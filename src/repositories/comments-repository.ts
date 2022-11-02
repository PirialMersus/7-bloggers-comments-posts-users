import {injectable} from "inversify";
import {IComment} from "../types/types";
import {FindConditionsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {ObjectId, WithId} from "mongodb";
import {CommentsModel} from "./db";

@injectable()
export class CommentsRepository {
    async findCommentById(_id: ObjectId): Promise<IComment | null> {
        const comment = CommentsModel.findOne({_id}).select({_id: 0, __v: 0, postId: 0})
        if (comment) {
            return comment
        } else {
            return null
        }
    }

    async findCommentsByPostId({postId, pageNumber, pageSize, skip}: FindConditionsObjType,
                               sortBy: keyof IComment,
                               sortDirection: string): Promise<IReturnedFindObj<IComment>> {
        const count = await CommentsModel.find({postId}).count()
        const foundComments: WithId<IComment>[] = await CommentsModel
            .find({postId})
            .select({_id: 0, __v: 0, postId: 0})
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
                items: foundComments
            })
        })
    }

    async createComment(comment: IComment): Promise<IComment | null> {
        console.log('comment', comment)
        await CommentsModel.insertMany([comment])
        return CommentsModel.findOne({_id: comment._id}).select({_id: 0, __v: 0, postId: 0})
    }

    async updateComment(_id: ObjectId, content: string): Promise<boolean> {
        let result: {matchedCount: number} = await CommentsModel.updateOne({_id}, {
            $set: {content}
        })
        return result.matchedCount === 1
    }

    async deleteComment(_id: ObjectId): Promise<boolean> {
        const result: {deletedCount: number} = await CommentsModel.deleteOne({_id})
        return result.deletedCount === 1
    }
}