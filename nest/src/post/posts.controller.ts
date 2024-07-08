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
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { Post as PostEntity, PostStatus } from './post.entity';
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

  @Get('/approved')
  async findApprovedPosts() {
    const posts = await this.postsService.findApprovedPosts();
    return posts.map((post) => this.postsService.toPostDto(post));
  }

  @Post('')
  async create(@Request() req: RequestWithUser, @Body() post: PostEntity) {
    const userId = req.user.sub;
    const savedPost = await this.postsService.create(userId, post);
    return this.postsService.toPostDto(savedPost);
  }

  @Put('')
  async update(@Request() req: RequestWithUser, @Body() post: PostEntity) {
    const userId = req.user.sub;
    const updatedPost = await this.postsService.update(userId, post);
    return this.postsService.toPostDto(updatedPost);
  }

  @Get('/admin')
  @Roles(Role.Admin)
  async findAll() {
    const posts = await this.postsService.findAll();
    return posts.map((post) => this.postsService.toPostDto(post));
  }

  @Put('/admin/:id/review')
  @Roles(Role.Admin)
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: PostStatus,
    @Body('comment') comment: string,
  ) {
    const updatedPost = await this.postsService.updateStatus(
      id,
      status,
      comment,
    );
    return this.postsService.toPostDto(updatedPost);
  }

  @Put('/:id/read')
  async markAsRead(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    const updatedPost = await this.postsService.markAsRead(userId, id);
    return this.postsService.toPostDto(updatedPost);
  }

  @Get('/:id')
  async findOne(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    const post = await this.postsService.findOne(userId, id);
    return this.postsService.toPostDto(post);
  }

  @Delete('/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    const userId = req.user.sub;
    const deletedPost = await this.postsService.remove(userId, id);
    return this.postsService.toPostDto(deletedPost);
  }
}
