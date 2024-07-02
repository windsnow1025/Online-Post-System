import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async find(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    const posts = await this.postsService.find(userId);
    return posts.map((post) => this.postsService.toPostDto(post));
  }

  @Post('/post')
  async create(@Request() req: RequestWithUser, @Body() post: PostEntity) {
    const userId = req.user.sub;
    const savedPost = await this.postsService.create(userId, post);
    return this.postsService.toPostDto(savedPost);
  }

  @Put('/post')
  async update(@Request() req: RequestWithUser, @Body() post: PostEntity) {
    const userId = req.user.sub;
    const updatedPost = await this.postsService.update(userId, post);
    return this.postsService.toPostDto(updatedPost);
  }

  @Delete('/post/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    const deletedPost = await this.postsService.remove(userId, id);
    return this.postsService.toPostDto(deletedPost);
  }
}
