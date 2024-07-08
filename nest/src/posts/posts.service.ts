import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post, PostStatus } from './post.entity';
import { UsersService } from '../users/users.service';
import { PostDto } from './dto/post.dto';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
  ) {}

  public toPostDto(post: Post) {
    const postDto: PostDto = {
      id: post.id,
      title: post.title,
      content: post.content,
      url: post.url,
      status: post.status,
      comment: post.comment,
      isRead: post.isRead,
      user: this.usersService.toUserDto(post.user),
      likes: post.likes.length,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user: this.usersService.toUserDto(comment.user),
      })),
    };
    return postDto;
  }

  async find(userId: number) {
    const postIds = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .where('user.id = :userId', { userId })
      .select('post.id')
      .getMany();

    const ids = postIds.map((post) => post.id);

    if (ids.length === 0) {
      return [];
    }

    return this.postsRepository.find({
      where: { id: In(ids) },
      relations: ['user'],
    });
  }

  async findAll() {
    return this.postsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(userId: number, id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId && post.status !== PostStatus.APPROVED) {
      throw new ForbiddenException();
    }

    return post;
  }

  async findApprovedPosts() {
    return this.postsRepository.find({
      where: { status: PostStatus.APPROVED },
      relations: ['user'],
    });
  }

  async create(userId: number, post: Post) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    post.user = user;
    return await this.postsRepository.save(post);
  }

  async update(userId: number, newPost: Post) {
    const post = await this.findOne(userId, newPost.id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.title = newPost.title;
    post.content = newPost.content;
    post.url = newPost.url;
    post.status = PostStatus.PENDING;

    return await this.postsRepository.save(post);
  }

  async updateStatus(id: number, status: PostStatus, comment: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.status = status;
    post.comment = comment;
    post.isRead = false;

    return await this.postsRepository.save(post);
  }

  async updateRead(userId: number, id: number) {
    const post = await this.findOne(userId, id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.isRead = true;

    return await this.postsRepository.save(post);
  }

  async remove(userId: number, id: number) {
    const post = await this.findOne(userId, id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postsRepository.remove(post);
  }

  async likePost(userId: number, postId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postsRepository.findOne({
      where: { id: postId, status: PostStatus.APPROVED },
      relations: ['likes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found or not approved');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      throw new ForbiddenException('User has already liked this post');
    }

    const like = new Like();
    like.user = user;
    like.post = post;

    return await this.likesRepository.save(like);
  }

  async commentOnPost(userId: number, postId: number, content: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postsRepository.findOne({
      where: { id: postId, status: PostStatus.APPROVED },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException('Post not found or not approved');
    }

    const comment = new Comment();
    comment.user = user;
    comment.post = post;
    comment.content = content;

    return await this.commentsRepository.save(comment);
  }
}
