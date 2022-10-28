import {Router} from 'express'
import {body, param} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
// import {usersService} from "../domain/users-service";
import {basicAuthMiddleware} from "../middlewares/authMiddleware";
import {container} from "../compositions/composition-root";
import {UsersController} from "../controllers/users-controller";

export const usersRouter = Router({})

const usersController = container.resolve(UsersController)

usersRouter.get('/', usersController.getUsers.bind(usersController))
    .post('/',
        basicAuthMiddleware,
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
        usersController.createUser.bind(usersController))
    .delete('/:id?',
        basicAuthMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        usersController.deleteUser.bind(usersController))
