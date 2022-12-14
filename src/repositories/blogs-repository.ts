import {BlogsModel} from "./db";
import {IFindObj} from "../domain/blogs-service";
import {injectable} from "inversify";
import {IBlog} from "../types/types";
import {ObjectId} from "mongodb";

export interface IReturnedFindObj<T> {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

@injectable()
export class BlogsRepository {
    async findBlogs({name, pageNumber, pageSize, skip}: IFindObj,
                    sortBy: keyof IBlog,
                    sortDirection: string): Promise<IReturnedFindObj<IBlog>> {
        const findObject: { name?: { $regex: RegExp } } = {}
        if (name) findObject.name = {$regex: new RegExp(name, "i")}
        const count = await BlogsModel.countDocuments(findObject)
        const foundBloggers: IBlog[] = await BlogsModel
            .find(findObject)
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
                items: foundBloggers
            })
        })
    }

    async findBlogById(_id: ObjectId): Promise<IBlog | null> {
        const blog = BlogsModel.findOne({_id}).select({_id: 0, __v: 0})
        if (blog) {
            return blog
        } else {
            return null
        }
    }

    async createBlog(newBlog: IBlog): Promise<IBlog | null> {
        await BlogsModel.insertMany([newBlog])
        return BlogsModel.findOne({_id: newBlog._id}).select({_id: 0, __v: 0})
    }

    async updateBlog(id: string, name: string, websiteUrl: string, description: string): Promise<boolean> {
        let result: { matchedCount: number } = await BlogsModel.updateOne({_id: id}, {
            $set: {name, websiteUrl, description}
        })
        return result.matchedCount === 1
    }

    async deleteBlog(_id: string): Promise<boolean> {
        const result: { deletedCount: number } = await BlogsModel.deleteOne({_id})
        return result.deletedCount === 1
    }

}