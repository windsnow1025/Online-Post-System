import { User } from './User';

export interface Post {
  id: number;
  title: string;
  content: string;
  url?: string;
  user: User;
}