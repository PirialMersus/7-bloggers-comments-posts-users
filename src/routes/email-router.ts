import {Request, Response, Router} from 'express'

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
            // await emailAdapter.sendMail(req.bod
            // y.email, req.body.message, req.body.subject)
            // const ip = req.headers['x-forwarded-for'] ||
            //     req.socket.remoteAddress ||
            //     null;
            // console.log('req.ip', ip)
            
            res.send({
                "email": req.body.email,
                "message": req.body.message,
                "subject": req.body.subject,
            })

        }
    )