import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from '../common/entities/base.entity';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  url: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
