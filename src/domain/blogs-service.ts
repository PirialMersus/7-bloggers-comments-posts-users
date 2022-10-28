import {BlogsRepository, IReturnedFindObj} from "../repositories/blogs-repository"
import {Blog} from "../repositories/db"
import {injectable} from "inversify";
import {IBlog} from "../types/types";

export interface IFindObj {
    name: string,
    pageNumber: number,
    pageSize: number,
    skip: number,
}

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {
    }

    findBlogs(name: string,
              pageNumber: number,
              pageSize: number,
              sortBy: keyof IBlog,
              sortDirection: string): Promise<IReturnedFindObj<IBlog>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: IFindObj = {
            name,
            pageNumber,
            pageSize,
            skip,
        }

        return this.blogsRepository.findBlogs(findConditionsObj, sortBy, sortDirection)
    }

    async findBlogById(id: string): Promise<IBlog | null> {
        return this.blogsRepository.findBlogById(id)
    }

    async createBlog(name: string, youtubeUrl: string): Promise<IBlog | null> {
        const date = new Date()
        const newBlog: Blog = Blog.create(name, youtubeUrl, date)

        return this.blogsRepository.createBlog(newBlog)
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, name, youtubeUrl)
    }

    async deleteBlogger(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id)
    }
}

// export const blogsService = new BlogsService()