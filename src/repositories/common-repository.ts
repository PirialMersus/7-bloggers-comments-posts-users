import {BlogsModel, CommentsModel, PostsModel, UsersModel} from "./db";


export const commonRepository = {
    async deleteAll(): Promise<boolean> {
        const resultBlogs: { deletedCount: number } = await BlogsModel.deleteMany({})
        const resultPosts: { deletedCount: number } = await PostsModel.deleteMany({})
        const resultUsers: { deletedCount: number } = await UsersModel.deleteMany({})
        const resultComments: { deletedCount: number } = await CommentsModel.deleteMany({})
        // const resultPosts = await postsCollection.deleteMany({})
        return resultBlogs.deletedCount >= 0
            && resultPosts.deletedCount >= 0
            && resultUsers.deletedCount >= 0
            && resultComments.deletedCount >= 0
    },
}

// {
//     "_id": "629711812a96d7ba6ae292c6",
//     "name": "new 222 blo222",
//     "youtubeUrl": "https://www.youtubecom/bla/222221",
//     "id": 1654067585795
// },
// {
//     "_id": "632704c3527353c507852044",
//     "name": "mongo test",
//     "youtubeUrl": "https://www.youtube.com/channel/UCNH9VJDJVt8pXg4TEUHh76w",
//     "id": 1663501507285
// }