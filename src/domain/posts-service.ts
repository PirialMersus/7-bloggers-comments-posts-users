import {BlogsRepository, IReturnedFindObj} from "../repositories/blogs-repository"
import {Post} from "../repositories/db"
import {PostsRepository} from "../repositories/posts-repository"
import {injectable} from "inversify";
import {IPost} from "../types/types";

export type FindConditionsPostsObjType = {
    pageNumber: number
    pageSize: number
    skip: number
}
export type FindConditionsObjType = {
    blogId?: string
    postId?: string
    pageNumber: number
    pageSize: number
    skip: number
}

@injectable()
export class PostsService {

    constructor(protected postsRepository: PostsRepository, private readonly blogsRepository: BlogsRepository) {
    }

    findPosts(pageNumber: number,
              pageSize: number,
              sortBy: keyof IPost,
              sortDirection: string
    ): Promise<IReturnedFindObj<IPost>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsPostsObjType = {
            pageNumber,
            pageSize,
            skip,
        }
        return this.postsRepository.findPosts(findConditionsObj, sortBy, sortDirection)
    }

    async findPostById(id: string): Promise<IPost | null> {
        return this.postsRepository.findPostById(id)
    }

    async findPostsByBlogId(blogId: string,
                            pageNumber: number,
                            pageSize: number,
                            sortBy: keyof IPost,
                            sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsObjType = {
            blogId,
            pageNumber,
            pageSize,
            skip,
        }
        return this.postsRepository.findPostsByBlogId(findConditionsObj, sortBy, sortDirection)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        const blog = await this.blogsRepository.findBlogById(blogId)
        const date = new Date()
        const newPost: IPost = Post.create(title,
            shortDescription,
            content,
            blogId,
            blog?.name,
            date);
        return this.postsRepository.createPost(newPost)
    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePost(id)
    }
}