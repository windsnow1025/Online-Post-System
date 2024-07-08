import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { BaseEntity } from '../common/entities/base.entity';
import { Post } from '../posts/post.entity';
import { Like } from '../posts/like.entity';
import { Comment } from '../posts/comment.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  roles: Role[];

  @Column({ type: 'float', default: 0 })
  credit: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
