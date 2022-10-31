export const serializedPostsSortBy = (value: string) => {
    switch (value) {
        case 'blogId':
            return 'blogId';
        case 'title':
            return 'title';
        case 'shortDescription':
            return 'shortDescription'
        case '_id':
            return '_id'
        case 'content':
            return 'content'
        case 'blogName':
            return 'blogName'
        default:
            return 'createdAt'
    }
}
export const serializedCommentsSortBy = (value: string) => {
    switch (value) {
        case 'content':
            return 'content';
        case 'userId':
            return 'userId';
        case 'userLogin':
            return 'userLogin'
        case '_id':
            return '_id'
        default:
            return 'createdAt'
    }
}
export const serializedUsersSortBy = (value: string) => {
    switch (value) {
        case 'login':
            return 'login';
        case 'email':
            return 'email'
        default:
            return 'createdAt'
    }
}