import {Router} from 'express'
import {container} from "../compositions/composition-root";
import {bearerAuthMiddleware, isItUserCom} from "../middlewares/authMiddleware";
import {body, param} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {CommentsController} from "../controllers/comments-controller";

export const commentsRouter = Router({})


const commentsController = container.resolve(CommentsController)
commentsRouter
    .get('/:id',
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        commentsController.getComment.bind(commentsController)
    )
    .put('/:id',
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('content').isLength({max: 300, min: 20}).withMessage('content: maxLength: 300 minLength: 20'),
        bearerAuthMiddleware,
        isItUserCom,
        inputValidatorMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete('/:id',
        bearerAuthMiddleware,
        isItUserCom,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        commentsController.deleteComment.bind(commentsController)
    )