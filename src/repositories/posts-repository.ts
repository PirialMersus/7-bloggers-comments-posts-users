import {BlogsRepository, IReturnedFindObj} from "./blogs-repository";
import {FindConditionsObjType, FindConditionsPostsObjType} from "../domain/posts-service";
import {injectable} from "inversify";
import {IBlog, IPost} from "../types/types";
import {PostsModel} from "./db";

@injectable()
export class PostsRepository {
    constructor(private readonly blogsRepository: BlogsRepository) {
    }

    async findPosts({pageNumber, pageSize, skip}: FindConditionsPostsObjType,
                    sortBy: keyof IPost,
                    sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const count = await PostsModel.find({}).count()
        const foundPosts: IPost[] = await PostsModel
            .find({})
            .select({_id: 0, __v: 0})
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
                items: foundPosts
            })
        })
    }

    async findPostById(id: string): Promise<IPost | null> {
        let post = PostsModel.findOne({id}).select({_id: 0, __v: 0})
        if (post) {
            return post
        } else {
            return null
        }
    }

    async findPostsByBlogId({blogId, pageNumber, pageSize, skip}: FindConditionsObjType,
                            sortBy: keyof IPost,
                            sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const count = await PostsModel.find({blogId}).count()
        const foundPosts: IPost[] = await PostsModel
            .find({blogId})
            .select({_id: 0, __v: 0})
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
                items: foundPosts
            })
        })
    }

    // have to have return value type
    async createPost(newPost: IPost): Promise<IPost | null> {
        await PostsModel.insertMany([newPost])
        return PostsModel.findOne({_id: newPost._id}).select({_id: 0, __v: 0})
    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        const blogger: IBlog | null = await this.blogsRepository.findBlogById(blogId)
        let result: { matchedCount: number } = await PostsModel.updateOne({id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogger?.name
                    ? blogger?.name
                    : 'unknown'
            }
        })
        return result.matchedCount === 1
    }

    async deletePost(id: string): Promise<boolean> {
        const result: { deletedCount: number } = await PostsModel.deleteOne({id})
        return result.deletedCount === 1
    }
}

//export const postsRepository = new PostsRepository()