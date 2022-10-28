// import {injectable} from "inversify";
// import {IUser} from "../types/types";
// import bcrypt from "bcrypt";
// import {User} from "../repositories/db";
// import {jwtService} from "../application/jwtService";
// import {emailAdapter} from "../adapters/email-adapter";
//
// @injectable()
// export class AuthService {
//
//     async registerUser(login: string, password: string, email: string): Promise<IUser | null> {
//         const passwordSalt = await bcrypt.genSalt(10)
//         const passwordHash = await jwtService.generateHash(password, passwordSalt)
//         const date = new Date()
//
//         const newUser: User = User.create(login, email, passwordSalt, passwordHash, date)
//         const accessToken = jwtService.createJWT(newUser)
//
//         const createdUser = await this.usersRepository.createUser(newUser)
//         try {
//             await emailAdapter.sendMail(email, 'account is ready', 'email confirmation')
//         } catch (error) {
//             console.error(error)
//             await this.usersRepository.deleteUser(newUser._id)
//             return null
//         }
//
//         return createdUser
//     }
// }