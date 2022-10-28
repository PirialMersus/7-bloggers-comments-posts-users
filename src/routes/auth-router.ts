import {Router} from 'express'
import {container} from "../compositions/composition-root";
import {AuthController} from "../controllers/auth-controller";
import {bearerAuthMiddleware} from "../middlewares/authMiddleware";
import {UsersController} from "../controllers/users-controller";
import {body} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
// import {limiter} from "../middlewares/rate-limiter";

export const authRouter = Router({})


const authController = container.resolve(AuthController)
const usersController = container.resolve(UsersController)
authRouter
    .post('/registration-confirmation',
        // limiter,
        authController.registerConfirm
    )
    .post('/registration-email-resending',
        // limiter,
        authController.registerConfirm
    )

    .post('/registration',
        body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),
        body('email').trim().not().isEmpty().withMessage('enter input value in email field'),
        body('email').isLength({max: 100}).withMessage('email length should be less then 100'),
        body('email').custom((value, {req}) => {
            const regExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
            if (!regExp.test(req.body.email)) {
                throw new Error('enter correct value to email field  123');
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
        usersController.getUser.bind(authController)
    )