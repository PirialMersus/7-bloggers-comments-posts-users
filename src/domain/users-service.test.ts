import "reflect-metadata";
import {UsersService} from "./users-service";
import {UsersRepository} from "../repositories/users-repository";
import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoClient} from "mongodb";

describe('integration test for users service', () => {

    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        const client = new MongoClient(mongoUri);
        await client.connect()
    })

    describe('create user', () => {
        const userService = new UsersService(new UsersRepository)
        it('create user should return', async () => {
            const email = 'blafgsdfg@gmail.com';
            const login = 'testLogin';
            const result = await userService.createUser(login, '123123', email)
            expect(result?.accountData.email).toBe(email)
            expect(result?.accountData.login).toBe(login)
            expect(result?.accountData.createdAt).toBeTruthy()
        })
    })
    describe('findUserByIdAllDataReturn method works correct', () => {
        const userService = new UsersService(new UsersRepository)
        it('findUserByIdAllDataReturn user should return', async () => {
            const email = 'blafgsdfg@gmail.com';
            const login = 'testLogin';
            const foundUser = await userService.createUser(login, '123123', email)
            const userId = foundUser!._id

            const result = await userService.findUserByIdAllDataReturn(userId)
            expect(result?.accountData.email).toBe(email)
            expect(result?.accountData.login).toBe(login)
            expect(result?.accountData.createdAt).toBeTruthy()
            expect(typeof result?.accountData.passwordHash).toBe('string')
        })
    })
    describe('deleteUser method works correct', () => {
        const userService = new UsersService(new UsersRepository)
        it('deleteUser user should work correct', async () => {
            const email = 'blafgsdfg@gmail.com';
            const login = 'testLogin';
            const foundUser1 = await userService.createUser(login, '123123', email)
            const userId = foundUser1!._id
            const foundUser2 = await userService.createUser(
                'second user',
                '123123123',
                'blaf22gsdfg@gmail.com'
            )

            expect(foundUser1?.accountData.email).toBe(email)
            expect(foundUser1?.accountData.login).toBe(login)
            expect(foundUser1?.accountData.createdAt).toBeTruthy()
            const result = await userService.findUserByIdAllDataReturn(userId)

            expect(result?.accountData.email).toBe(email)
            expect(result?.accountData.login).toBe(login)
            expect(result?.accountData.createdAt).toBeTruthy()
            expect(typeof result?.accountData.passwordHash).toBe('string')

            const isUserDeleted = await userService.deleteUser(userId)
            expect(isUserDeleted).toBeTruthy()

            const deletedUser = await userService.findUserByIdAllDataReturn(userId)
            expect(deletedUser).toBeFalsy()

        })
    })
    describe('findUsers method works correct', () => {


        it('findUsers user should return users', async () => {
            const userService = new UsersService(new UsersRepository)
            const email = 'blafgsdfg@gmail.com';
            const login = 'testLogin';
            const foundUser1 = await userService.createUser(login, '123123', email)
            const foundUser2 = await userService.createUser(
                'second user',
                '123123123',
                'blaf22gsdfg@gmail.com'
            )
            const result = await userService.findUsers(1, 4, 'createdAt','','','')
            expect(result.items.length).toBe(2)
        })
        it('findUsers with search login term works correct', async () => {
            const userService = new UsersService(new UsersRepository)
            console.log('4444444444', await userService.findUsers(1, 100, 'createdAt','','',''))
            const email = 'blafgsdfg@gmail.com';
            const login = 'testLogin';
            const foundUser1 = await userService.createUser(login, '123123', email)
            const foundUser2 = await userService.createUser(
                'second user',
                '123123123',
                'blaf22gsdfg@gmail.com'
            )
            const result = await userService.findUsers(1, 4, 'createdAt','','test','')
            // console.log('result.items', result.items)
            expect(result.items.length).toBe(1)
            expect(result.items[0].accountData.login).toBe(login)
        })
    })
})