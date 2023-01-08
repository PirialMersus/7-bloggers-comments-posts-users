import {TokensBlacklistModel, User, UsersModel} from "./db";
import {FindConditionsPostsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";
import {AccountDataType, IUser} from "../types/types";

@injectable()
export class UsersRepository {
    async findUsers({pageNumber, pageSize, skip}: FindConditionsPostsObjType,
                    sortBy: keyof AccountDataType,
                    sortDirection: string,
                    searchLoginTerm: string | null,
                    searchEmailTerm: string | null): Promise<IReturnedFindObj<IUser>> {
        const findObject = {
            $or: [{
                login: {
                    $regex: searchLoginTerm || '',
                    $options: "(?i)a(?-i)cme"
                }
            }, {email: {$regex: searchEmailTerm || '', $options: "(?i)a(?-i)cme"}}]
        }
        const count = await UsersModel.find(findObject).count()
        const foundUsers: WithId<IUser>[] = await UsersModel
            .find(findObject)
            .select({_id: 0, __v: 0, passwordSalt: 0, passwordHash: 0})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip(skip)
            .limit(pageSize)
            .lean()

        return new Promise((resolve) => {
            resolve({
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: foundUsers
            })
        })
    }

    async findUserById(_id: ObjectId): Promise<IUser | null> {
        let user = UsersModel.findOne({_id}).select({__v: 0})
        if (user) {
            return user
        } else {
            return null
        }
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return UsersModel.findOne({'accountData.email': email}).select({_id: 0, __v: 0})
    }

    async findUserByLogin(login: string): Promise<IUser | null> {
        return UsersModel.findOne({'accountData.login': login}).select({__v: 0})
    }

    async createUser(newUser: IUser): Promise<IUser | null> {
        await UsersModel.insertMany([newUser])
        return UsersModel.findOne({_id: newUser._id})
            .select({_id: 0, __v: 0, postId: 0, passwordSalt: 0, passwordHash: 0,})
    }

    async deleteUser(_id: ObjectId): Promise<boolean> {
        const result: { deletedCount: number } = await UsersModel.deleteOne({_id})
        return result.deletedCount === 1
    }

    async findUser(login: string): Promise<IUser | null> {
        return UsersModel.findOne({login: login})
    }

    async findUserByConfirmationCode(code: string): Promise<IUser | null> {
        return UsersModel.findOne({'emailConfirmation.confirmationCode': code})
    }

    async findUserByRefreshToken(refreshToken: string): Promise<IUser | null> {
        return UsersModel.findOne({'accountData.refreshToken': refreshToken})
    }

    async checkRefreshTokenValidity(refreshToken: string, userId: ObjectId): Promise<boolean> {
        return !await UsersModel.find({$and: [{'accountData.invalidateRefreshTokens': {$in: refreshToken}}, {_id: userId}]})
    }

    async addTokensToBlackList(user: IUser): Promise<boolean> {
        await TokensBlacklistModel.findOneAndUpdate({'data': 'refreshTokensBlackList'}, {$push: {'data': user.accountData.refreshToken}}, function (error: string) {
            if (error) {
                return false
            }
        })
        await TokensBlacklistModel.findOneAndUpdate({'data': 'accessTokensBlackList'}, {$push: {'data': user.accountData.accessToken}}, function (error: string) {
            if (error) {
                return false
            }
        })
        return true
    }

    async deleteUserTokens(user: IUser): Promise<boolean> {
        const result: { matchedCount: number } = await UsersModel.updateOne({'_id': user._id},
            {
                $set: {'accountData.accessToken': '', 'accountData.refreshToken': ''}
            })
        return result.matchedCount === 1
    }

    async confirmUser(code: string): Promise<boolean> {
        const result: { matchedCount: number } = await UsersModel.updateOne({'emailConfirmation.confirmationCode': code},
            {
                $set: {'emailConfirmation.isConfirmed': true}
            })
        return result.matchedCount === 1
    }

    async updateUserEmailConfirmation(id: ObjectId, emailConfirmationCode: string): Promise<boolean> {
        const result: { matchedCount: number } = await UsersModel.updateOne({id},
            {
                $set: {'emailConfirmation.confirmationCode': emailConfirmationCode}
            })
        return result.matchedCount === 1
    }

    async confirmUserByEmail(_id: ObjectId): Promise<boolean> {
        const result: { modifiedCount: number } = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    async addRefreshAndAccessTokensToUser(_id: ObjectId, accessToken: string, refreshToken: string): Promise<Boolean> {
        let result: { matchedCount: number } = await UsersModel.updateOne({_id}, {
            $set: {'accountData.accessToken': accessToken, 'accountData.refreshToken': refreshToken,}
        })
        return result.matchedCount === 1
    }

    async addInvalidateRefreshTokenToUser(user: User): Promise<Boolean> {
        let result: { matchedCount: number } = await UsersModel.updateOne({_id: user._id}, {
            $addToSet: {'accountData.invalidateRefreshTokens': user.accountData.refreshToken}
        })
        return result.matchedCount === 1
    }
}