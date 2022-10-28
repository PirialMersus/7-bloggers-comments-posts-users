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
    id: string,
    createdAt: string
}
export interface IPost {
    id: string,
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogName: string,
    createdAt: string
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
    accountData: AccountDataType,
    emailConfirmation: EmailConfirmationType
}
export interface IComment {
    _id: ObjectId,
    content: string,
    userId: ObjectId,
    createdAt: string,
    userLogin: string,
    postId: string,
    id: string
}

export interface IPassword {
    id: number,
    service: string,
    name: string,
    password: string,
}