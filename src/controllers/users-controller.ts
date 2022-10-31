import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {errorObj} from "../middlewares/input-validator-middleware";
import {injectable} from "inversify";
import {IQuery, IUser} from "../types/types";
import {serializedUsersSortBy} from "../utils/helpers";
import {ObjectId} from "mongodb";

@injectable()
export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: Request<{}, {}, {}, IQuery>, res: Response) {
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : ''
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : ''
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const users: IReturnedFindObj<IUser> = await this.usersService.findUsers(
            pageNumber,
            pageSize,
            serializedUsersSortBy(sortBy),
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
        res.send(users);
    }

    getUser = async (req: Request, res: Response) => {
        const user = await this.usersService.findUserByIdSomeDataReturn(req.user!._id)

        if (user) {
            res.status(200).send(user)
        } else {
            res.sendStatus(401);
        }

    }

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (newUser) {
            res.status(201).send({
                id: newUser._id,
                login: newUser.accountData.login,
                email: newUser.accountData.email,
                createdAt: newUser.accountData.createdAt
            })
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant create new user',
                field: 'none',
            }]
            res.status(404).send(errorObj.errorsMessages)
        }
    }

    async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.usersService.deleteUser(ObjectId.createFromHexString(id))

        if (!isDeleted) {
            errorObj.errorsMessages = [{
                message: 'Required user not found',
                field: 'none',
            }]
            res.status(404).send(errorObj.errorsMessages[0].message)
        } else {
            res.sendStatus(204)
        }
    }
}