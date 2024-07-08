import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment]), UsersModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
