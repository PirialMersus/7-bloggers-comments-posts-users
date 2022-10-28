import "reflect-metadata";
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {runDb} from './repositories/db'
import {blogsRouter} from './routes/blogs-router'
import {postsRouter} from './routes/posts-router'
import {usersRouter} from "./routes/users-router"
import {commonRepository} from "./repositories/common-repository";
import {errorObj} from "./middlewares/input-validator-middleware";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {emailRouter} from "./routes/email-router";
const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use(cors());

const port = process.env.PORT || 5000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!')
})

app.use('/blogs', blogsRouter)
app.use('/email', emailRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    const isAllDeleted = await commonRepository.deleteAll();
    if (isAllDeleted) {
        res.sendStatus(204)
    }else {
        errorObj.errorsMessages = [{
            message: 'Something wrong on the server',
            field: 'none',
        }]
        res.status(404).send(errorObj)
    }
})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()