import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post, PostStatus } from './post.entity';
import { UsersService } from '../users/users.service';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  public toPostDto(post: Post) {
    const postDto: PostDto = {
      id: post.id,
      title: post.title,
      content: post.content,
      url: post.url,
      status: post.status,
      user: this.usersService.toUserDto(post.user),
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

    post.status = PostStatus.PENDING;
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

  async updateStatus(id: number, status: PostStatus) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.status = status;

    return await this.postsRepository.save(post);
  }

  async remove(userId: number, id: number) {
    const post = await this.findOne(userId, id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postsRepository.remove(post);
  }
}
