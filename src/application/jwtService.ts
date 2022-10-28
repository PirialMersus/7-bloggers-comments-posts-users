import jwt from "jsonwebtoken"
import {settings} from "../settings/settings";
import {IUser} from "../types/types";
import bcrypt from "bcrypt";

export const jwtService = {
    async createJWT(user: IUser) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: '100h'})
        return token
    },
    async generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}