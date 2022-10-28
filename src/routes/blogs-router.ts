import {Router} from 'express'
import {body, param} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {basicAuthMiddleware} from "../middlewares/authMiddleware";
import {BlogsController} from "../controllers/blogs-controller";
import {container} from "../compositions/composition-root";

export const blogsRouter = Router({})
const blogsController = container.resolve(BlogsController);

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
    .get('/:blogId?',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        blogsController.getBlog.bind(blogsController))
    .get('/:blogId/posts',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        blogsController.getPostsOfTheBlog.bind(blogsController))
    .post('/',
        basicAuthMiddleware,
        body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }
            return true;
        }),
        inputValidatorMiddleware,
        blogsController.createBlog.bind(blogsController))
    .post('/:blogId/posts',
        basicAuthMiddleware,
        param('blogId').trim().not().isEmpty().withMessage('enter blogId value in params'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        param('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),

        inputValidatorMiddleware,
        blogsController.createPostForBlog.bind(blogsController))
    .put('/:id?',
        basicAuthMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }
            return true;
        }),
        inputValidatorMiddleware,
        blogsController.updateBlog.bind(blogsController))
    .delete('/:id?',
        basicAuthMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        blogsController.deleteBlog.bind(blogsController))