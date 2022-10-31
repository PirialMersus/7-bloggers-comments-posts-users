import {Router} from 'express'
import {container} from "../compositions/composition-root";
import {AuthController} from "../controllers/auth-controller";
import {bearerAuthMiddleware} from "../middlewares/authMiddleware";
import {UsersController} from "../controllers/users-controller";
import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {UsersRepository} from "../repositories/users-repository";
// import {limiter} from "../middlewares/rate-limiter";

export const authRouter = Router({})


const authController = container.resolve(AuthController)
const usersController = container.resolve(UsersController)
const usersRepository = container.resolve(UsersRepository)
authRouter
    .post('/registration-confirmation',
        body('code').trim().not().isEmpty().withMessage('enter input value in code field'),
        // limiter,
        body('code').custom(async (value) => {
            const user = await usersRepository.findUserByConfirmationCode(value)
            if (!user) throw new Error('code is incorrect');
            if (user.emailConfirmation.isConfirmed) {
                throw new Error('code is already confirmed');
            }
            return true;
        }),
        inputValidatorMiddleware,
        authController.registerConfirm
    )
    .post('/registration-email-resending',
        // limiter,
        body('email').trim().not().isEmpty().withMessage('enter input value in email field'),
        body('email').isLength({max: 100}).withMessage('email length should be less then 100'),
        body('email').custom(async (value, {req}) => {
            const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
            if (!regExp.test(req.body.email)) {
                throw new Error('enter correct value to email field');
            }
            return true;
        }),
        body('email').custom(async (value, {req}) => {
            const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
            if (!regExp.test(req.body.email)) {
                throw new Error('enter correct value to email field');
            }
            const foundUserByEmail = await usersRepository.findUserByEmail(value)
            console.log('foundUserByEmail', foundUserByEmail)
            if (!foundUserByEmail) {
                throw new Error('User with such email doesnt exist');
            }
            if (foundUserByEmail.emailConfirmation.isConfirmed) {
                throw new Error('User with such email is already confirmed');
            }
            return true;
        }),
        inputValidatorMiddleware,
        authController.registerEmailResending
    )

    .post('/registration',
        body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),
        body('email').trim().not().isEmpty().withMessage('enter input value in email field'),
        body('email').isLength({max: 100}).withMessage('email length should be less then 100'),
        body('email').custom(async (value, {req}) => {
            const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
            if (!regExp.test(req.body.email)) {
                throw new Error('enter correct value to email field');
            }
            const foundUserByEmail = await usersRepository.findUserByEmail(value)
            if (foundUserByEmail) {
                throw new Error('User with such email is exist');
            }
            return true;
        }),
        body('login').custom(async (value) => {
            const foundUserByLogin = await usersRepository.findUserByLogin(value)
            if (foundUserByLogin) {
                throw new Error('User with such login is exist');
            }
            return true;
        }),
        inputValidatorMiddleware,
        // limiter,
        authController.createUser
    )
    .post('/login',
        body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // limiter,
        authController.checkCredentials
    )
    .post('/confirm-email',
        authController.confirmEmail
    )
    .get('/me',
        bearerAuthMiddleware,
        usersController.getUser
    )