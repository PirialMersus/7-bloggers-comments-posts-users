import {UsersModel} from "./db";
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
        let user = UsersModel.findOne({_id}).select({_id: 0, __v: 0})
        if (user) {
            return user
        } else {
            return null
        }
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
        const user = await UsersModel.findOne({'emailConfirmation.confirmationCode': code})
        return user
    }

    async updateConfirmation(_id: ObjectId): Promise<boolean> {
        const result: { modifiedCount: number } = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
}