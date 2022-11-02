import {injectable} from "inversify";
import {Comment} from "../repositories/db"
import {IComment, IPost, IUser} from "../types/types";
import {CommentsRepository} from "../repositories/comments-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsObjType} from "./posts-service";
import {ObjectId} from "mongodb";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async findCommentById(_id: ObjectId): Promise<IComment | null> {
        return this.commentsRepository.findCommentById(_id)
    }

    async findCommentsByPostId(postId: string,
                               pageNumber: number,
                               pageSize: number,
                               sortBy: keyof IComment,
                               sortDirection: string): Promise<IReturnedFindObj<IComment>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsObjType = {
            postId,
            pageNumber,
            pageSize,
            skip,
        }
        return this.commentsRepository.findCommentsByPostId(findConditionsObj, sortBy, sortDirection)
    }

    async updateComment(_id: ObjectId, content: string, userId: ObjectId | undefined) {
        const comment = await this.commentsRepository.findCommentById(_id)
        console.log('comment', comment)
        console.log('content', content)
        console.log('_id', _id)
        if (comment?.userId.toString() !== userId?.toString()) {
            console.log('comment?.userId', comment?.userId)
            console.log('userId', userId)
            return 'notMyOwnComment'
        }
        return this.commentsRepository.updateComment(_id, content)
    }

    async createComment(post: IPost, content: string, user: IUser): Promise<IComment | null> {
        const date = new Date()
        const newComment: IComment = Comment.create(content,
            user._id,
            user.accountData.login,
            post.id,
            date);
        return this.commentsRepository.createComment(newComment)
    }

    async deleteComment(id: ObjectId, userId: ObjectId | undefined): Promise<boolean | 'notMyComment'> {
        const comment = await this.commentsRepository.findCommentById(id)
        if (comment?.userId.toString() !== userId?.toString()) return 'notMyComment'
        return this.commentsRepository.deleteComment(id)
    }
}