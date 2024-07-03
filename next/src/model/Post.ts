import { User } from './User';

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Post {
  id: number;
  title: string;
  content: string;
  url: string;
  status: PostStatus;
  user: User;
}