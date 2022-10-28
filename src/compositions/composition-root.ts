import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../controllers/blogs-controller";
import {Container} from "inversify";
import {PostsRepository} from "../repositories/posts-repository";
import {PostsService} from "../domain/posts-service";
import {PostsController} from "../controllers/posts-controller";
import {UsersRepository} from "../repositories/users-repository";
import {UsersService} from "../domain/users-service";
import {UsersController} from "../controllers/users-controller";
import {AuthController} from "../controllers/auth-controller";
import {CommentsController} from "../controllers/comments-controller";
import {CommentsService} from "../domain/comments-service";
import {CommentsRepository} from "../repositories/comments-repository";

export const container = new Container();
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);

container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsRepository).to(CommentsRepository);


container.bind(AuthController).to(AuthController);
