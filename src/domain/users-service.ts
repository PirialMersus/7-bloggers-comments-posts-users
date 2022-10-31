import {User} from "../repositories/db"
import {UsersRepository} from "../repositories/users-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsPostsObjType} from "./posts-service";
import bcrypt from 'bcrypt'
import {injectable} from "inversify";
import {AccountDataType, IUser} from "../types/types";
import {emailAdapter} from "../adapters/email-adapter";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwtService";
import jwt from "jsonwebtoken";
import {settings} from "../settings/settings";

@injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository) {
    }

    findUsers(pageNumber: number,
              pageSize: number,
              sortBy: keyof AccountDataType,
              sortDirection: string,
              searchLoginTerm: string | null,
              searchEmailTerm: string | null
    ): Promise<IReturnedFindObj<IUser>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsPostsObjType = {
            pageNumber,
            pageSize,
            skip,
        }
        return this.usersRepository.findUsers(findConditionsObj,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
    }

    async findUserByIdAllDataReturn(id: ObjectId) {
        const user = await this.usersRepository.findUserById(id)
        if (!user) return null
        return user
    }

    async findUserByIdSomeDataReturn(id: ObjectId) {
        const user = await this.usersRepository.findUserById(id)
        if (!user) return null

        return {
            email: user.accountData.email,
            login: user.accountData.login,
            userId: user._id
        }
    }

    async createUser(login: string, email: string, password: string, isConfirmed: boolean = false): Promise<IUser | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await jwtService.generateHash(password, passwordSalt)
        const date = new Date()

        const newUser: User = User.create(login, email, passwordSalt, passwordHash, date, isConfirmed)
        const accessToken = await jwtService.createJWT(newUser)
        newUser.accountData.accessToken = accessToken

        const createdUser = await this.usersRepository.createUser(newUser)
        const user = await this.usersRepository.findUserByConfirmationCode(createdUser!.accountData.accessToken)
        console.log('createdUser', createdUser)
        console.log('user from bd', user)
        try {
            await emailAdapter.sendMail(email, 'account is ready', 'email confirmation', accessToken)
        } catch (error) {
            console.error(error)
            await this.usersRepository.deleteUser(newUser._id)
            return null
        }

        return createdUser
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        return true
    }

    async deleteUser(id: ObjectId): Promise<boolean> {
        return this.usersRepository.deleteUser(id)
    }

    async checkCredentials(login: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user: IUser | null = await this.usersRepository.findUser(login)
        if (!user) return null
        const passwordHash = await jwtService.generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) return null

        const accessToken = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '20s'})
        if (await this.usersRepository.addRefreshAndAccessTokensToUser(user._id, accessToken, refreshToken))
            return {accessToken, refreshToken}
        return null
    }

    async findUserByEmail(email: string,): Promise<IUser | null> {
        return this.usersRepository.findUserByEmail(email)
    }

    async registerEmailResending(email: string,): Promise<boolean> {
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user) return false
        try {
            await emailAdapter.sendMail(email, 'account is ready', 'email confirmation', user!.accountData.accessToken)
        } catch (error) {
            console.error(error)
            await this.usersRepository.deleteUser(user._id)
            return false
        }
        return true
    }

    async registerConfirm(code: string,): Promise<boolean> {
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        return user.emailConfirmation.expirationDate >= new Date();
    }
}

// export const usersService = new UsersService()
