import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {errorObj} from "../middlewares/input-validator-middleware";
import {injectable} from "inversify";

import {PostsService} from "../domain/posts-service";
import {IBlog, IPost, IRequest} from "../types/types";
import {serializedPostsSortBy} from "../utils/helpers";
import {ObjectId} from "mongodb";

const serializedBlogsSortBy = (value: string) => {
    switch (value) {
        case 'name':
            return 'name';
        case 'youtubeUrl':
            return 'youtubeUrl'
        case '_id':
            return '_id'
        default:
            return 'createdAt'
    }
}

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService, protected postsService: PostsService) {
    }

    async getBlogs(req: Request<{}, {}, {}, IRequest>, res: Response) {
        const name = req.query.searchNameTerm ? req.query.searchNameTerm : ''
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const response: IReturnedFindObj<IBlog> = await this.blogsService.findBlogs(name,
            pageNumber,
            pageSize,
            serializedBlogsSortBy(sortBy),
            sortDirection)
        res.send(response);
    }

    async getBlog(req: Request, res: Response) {
        let blog = await this.blogsService.findBlogById(ObjectId.createFromHexString(req.params.blogId))

        if (blog) {
            res.send(blog)
        } else {
            res.sendStatus(404)
        }
    }

    async getPostsOfTheBlog(req: Request<{ blogId: string }, {}, {}, IRequest>, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const blogId: string = req.params.blogId
        const isBloggerPresent = await this.blogsService.findBlogById(ObjectId.createFromHexString(blogId))
        if (isBloggerPresent) {
            const response: IReturnedFindObj<IPost> = await this.postsService.findPostsByBlogId(
                blogId,
                pageNumber,
                pageSize,
                serializedPostsSortBy(sortBy),
                sortDirection)
            res.send(response);
        } else {
            res.sendStatus(404);
        }

    }

    async createBlog(req: Request, res: Response) {
        const newBlog = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        if (newBlog) {
            console.log('returned blog', newBlog)
            res.status(201).send(newBlog)
        } else {
            res.sendStatus(400)
        }

    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId: string = req.params.blogId

        const isBlogPresent = await this.blogsService.findBlogById(ObjectId.createFromHexString(blogId))
        if (isBlogPresent) {
            const newPost = await this.postsService.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                blogId)
            res.status(201).send(newPost)
        } else {
            res.sendStatus(404);
        }
    }

    async updateBlog(req: Request, res: Response) {
        const name = req.body.name;
        const youtubeUrl = req.body.youtubeUrl;
        const id = req.params.id;

        const isUpdated: boolean = await this.blogsService.updateBlogger(id, name, youtubeUrl)
        if (isUpdated) {
            const blogger = await this.blogsService.findBlogById(ObjectId.createFromHexString(id))
            res.status(204).send(blogger)
        } else {
            errorObj.errorsMessages = [{
                message: 'Required blogger not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.blogsService.deleteBlogger(id)

        if (!isDeleted) {
            errorObj.errorsMessages = [{
                message: 'Required blogger not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        } else {
            res.sendStatus(204)
        }
    }
}