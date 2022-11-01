import {ObjectId} from "mongodb";

export type IRequest = {
    searchNameTerm: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
}
export interface IQuery {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: string
    pageSize: string
    sortBy: string,
    sortDirection: string,
}
export interface IBlog {
    name: string,
    youtubeUrl: string,
    createdAt: string
    id: ObjectId
    _id?: ObjectId
}
export interface IPost {
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogName: string,
    createdAt: string,
    _id: ObjectId,
    id: ObjectId,
}
export type AccountDataType = {
    login: string,
    email: string,
    createdAt: string,
    passwordSalt: string,
    passwordHash: string,
    accessToken: string,
    refreshToken: string,
}
export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
}
export interface IUser {
    _id: ObjectId,
    id: ObjectId,
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}
export interface IComment {
    _id: ObjectId,
    id: ObjectId,
    content: string,
    userId: ObjectId,
    createdAt: string,
    userLogin: string,
    postId: ObjectId,
}

export interface IPassword {
    id: number,
    service: string,
    name: string,
    password: string,
}