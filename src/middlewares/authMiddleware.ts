import {NextFunction, Request, Response} from "express";
import {container} from "../compositions/composition-root";
import {UsersService} from "../domain/users-service";
import {IUser} from "../types/types";
import {CommentsService} from "../domain/comments-service";
import jwt from "jsonwebtoken";
import {settings} from "../settings/settings";
import {ObjectId} from "mongodb";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // console.log('req.headers.authorization', req.headers.authorization)
    if (req.headers.authorization) {
        const base64FirstWorld = req.headers.authorization.split(' ')[0];
        const base64Credentials = req.headers.authorization.split(' ')[1];

        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
        if (`${base64FirstWorld} ${username}:${password}` === 'Basic admin:qwerty') {
            // if (username === 'admin' && password === 'qwerty') {
            next()
        } else {
            res.sendStatus(401)
        }
        return
    }
    res.sendStatus(401)
}

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    try {
        const result: any = jwt.verify(token, settings.JWT_SECRET)
        const user: IUser | null = await container.resolve(UsersService).findUserByIdAllDataReturn(result.userId)
        if (!user) {
            res.sendStatus(404)
            return
        }
        req.user = user
    } catch (e) {
        res.sendStatus(401)
        return
    }
    next()
}
export const isItUserCom = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id
    const comUser = await container.resolve(CommentsService).findCommentById(ObjectId.createFromHexString(commentId))
    if (!comUser) {
        res.sendStatus(404)
    } else if (comUser.userLogin != req.user?.accountData.login) {
        res.sendStatus(403)
    } else {
        next()
    }
}