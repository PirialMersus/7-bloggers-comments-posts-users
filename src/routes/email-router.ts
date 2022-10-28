import {Request, Response, Router} from 'express'
import {emailAdapter} from "../adapters/email-adapter";

export const emailRouter = Router({})

// const emailController = container.resolve(UsersController)
emailRouter
    .post('/send',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        // inputValidatorMiddleware,
        // bearerAuthMiddleware,
        async (req: Request, res: Response) => {
            // await emailAdapter.sendMail(req.body.email, req.body.message, req.body.subject)
            console.log('req.ip', req.ip)
            
            res.send({
                "email": req.body.email,
                "message": req.body.message,
                "subject": req.body.subject,
            })

        }
    )