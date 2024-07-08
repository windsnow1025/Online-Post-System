import { User } from '../common/user/User';

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Comment {
  id: number;
  content: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  url: string;
  status: PostStatus;
  comment: string;
  isRead: boolean;
  user: User;
  likes: number;
  comments: Comment[];
}
