import {MongoClient, ObjectId} from 'mongodb'
import {AccountDataType, EmailConfirmationType, IBlog, IComment, IPassword, IPost, IUser} from "../types/types";
import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add';


export class Blog implements IBlog {
    createdAt: string
    _id: ObjectId
    id: ObjectId

    private constructor(public name: string, public youtubeUrl: string, date: Date) {
        this.createdAt = date.toISOString()
        this._id = new ObjectId()
        this.id = this._id
    }

    static create = (name: string, youtubeUrl: string, date: Date) => {
        return new Blog(name, youtubeUrl, date)
    }
}

export class Comment implements IComment {
    createdAt: string
    _id: ObjectId

    private constructor(public content: string,
                        public userId: ObjectId,
                        public userLogin: string,
                        public postId: ObjectId,
                        date: Date) {
        this.createdAt = date.toISOString()
        this._id = new ObjectId()
    }

    static create = (content: string,
                     userId: ObjectId,
                     userLogin: string,
                     postId: ObjectId,
                     date: Date) => {
        return new Comment(content, userId, userLogin, postId, date)
    }
}


export class Post implements IPost {
    createdAt: string
    _id: ObjectId
    blogName: string
    static date: Date

    private constructor(public title: string,
                        public shortDescription: string,
                        public content: string,
                        public blogId: string,
                        possibleBlogName: string | undefined,
                        date: Date) {
        this.createdAt = date.toISOString()
        this._id = new ObjectId()
        this.blogName = possibleBlogName ? possibleBlogName : ''
    }

    static create = (title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string,
                     possibleBlogName: string | undefined,
                     date: Date) => {
        return new Post(title,
            shortDescription,
            content,
            blogId,
            possibleBlogName,
            date)
    }
}

export class User implements IUser {
    _id: ObjectId
    static date: Date
    accountData: AccountDataType
    emailConfirmation: EmailConfirmationType
    static login: string
    static email: string
    static passwordSalt: string
    static passwordHash: string

    private constructor(login: string,
                        email: string,
                        passwordSalt: string,
                        passwordHash: string,
                        date: Date,
                        isConfirmed: boolean) {
        this._id = new ObjectId()
        this.accountData = {
            login,
            email,
            createdAt: date.toISOString(),
            passwordSalt,
            passwordHash,
            accessToken: '',
            refreshToken: '',
        }
        this.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(date, {hours: 10, minutes: 3}),
            isConfirmed: isConfirmed,
        }
    }

    static create = (login: string,
                     email: string,
                     passwordSalt: string,
                     passwordHash: string,
                     date: Date, isConfirmed: boolean) => {
        return new User(login,
            email,
            passwordSalt,
            passwordHash,
            date, isConfirmed)
    }
}


export interface IPasswordObjectType {
    userId: number,
    passwords: IPassword[]
}

// const dbName = 'blogsPostsUsers';
const uri = "mongodb+srv://mersus:genafe@bloggers.ypwqb.mongodb.net/blogsPostsUsers?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
// export const blogsCollection = client.db().collection<IBlog>('blogs')
// export const postsCollection = client.db().collection<IPost>('posts')
// export const usersCollection = client.db().collection<IUser>('users')
// export const commentsCollection = client.db().collection<IComment>('comments')
const usersSchema = new mongoose.Schema<IUser>({
    _id: ObjectId,
    accountData: {
        login: String,
        email: String,
        createdAt: String,
        passwordSalt: String,
        passwordHash: String,
        accessToken: String,
        refreshToken: String,
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean,
    }
});
export const UsersModel = mongoose.model('users', usersSchema)

const blogsSchema = new mongoose.Schema<IBlog>({
    name: String,
    youtubeUrl: String,
    _id: String,
    createdAt: String,
    id: String
});
export const BlogsModel = mongoose.model('blogs', blogsSchema)

const postsSchema = new mongoose.Schema<IPost>({
    _id: String,
    blogId: String,
    title: String,
    shortDescription: String,
    content: String,
    blogName: String,
    createdAt: String
});
export const PostsModel = mongoose.model('posts', postsSchema)

const commentsSchema = new mongoose.Schema<IComment>({
    _id: ObjectId,
    userId: String,
    content: String,
    userLogin: String,
    postId: String,
    createdAt: String
});
export const CommentsModel = mongoose.model('comments', commentsSchema)


export async function runDb() {
    try {
        // await client.connect();
        // Establish and verify connection

        // const dataBaseUriFinal = uri + '/' + dbName;
        await mongoose.connect(uri);

        // await client.db("blogsPostsUsers").command({ping: 1});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect()
    }
}