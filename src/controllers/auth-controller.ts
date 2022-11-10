import {injectable} from "inversify";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {errorObj} from "../middlewares/input-validator-middleware";
import add from 'date-fns/add';

@injectable()
export class AuthController {
    constructor(protected usersService: UsersService) {
    }

    checkCredentials = async (req: Request, res: Response) => {
        const result = await this.usersService.checkCredentials(req.body.login, req.body.password)
        if (result) {
            res
                .cookie('refreshToken', result.refreshToken, {httpOnly: true, expires: add(new Date, {seconds: 23}),})
                .status(200).send({
                "accessToken": result.accessToken
            })
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant login this user',
                field: 'none',
            }]
            res.status(401).send(errorObj.errorsMessages[0].message)
        }
    }
    confirmEmail = async (req: Request, res: Response) => {
        const result = await this.usersService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(201)
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant confirm this user',
                field: 'none',
            }]
            res.status(400).send(errorObj.errorsMessages[0].message)
        }
    }
    createUser = async (req: Request, res: Response) => {
        const user = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)

        if (user) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
    registerConfirm = async (req: Request, res: Response) => {
        const isConfirmed = await this.usersService.registerConfirm(req.body.code)
        if (isConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
    registerEmailResending = async (req: Request, res: Response) => {
        const isSend = await this.usersService.registerEmailResending(req.body.email)
        if (isSend) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    // async getUserInformation(req: Request, res: Response) {
    //     const user = await this.usersService.checkCredentials(req.body.login, req.body.password)
    //
    //     if (user) {
    //         const token = await jwtService.createJWT(user)
    //         res.status(200).send(user)
    //     } else {
    //         errorObj.errorsMessages = [{
    //             message: 'Cant login this user',
    //             field: 'none',
    //         }]
    //         res.status(401).send(errorObj.errorsMessages[0].message)
    //     }
    // }
}