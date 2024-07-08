import { UserDto } from '../../users/dto/user.dto';
import { PostStatus } from '../post.entity';

export class PostDto {
  id: number;
  title: string;
  content: string;
  url: string;
  status: PostStatus;
  comment: string;
  isRead: boolean;
  user: UserDto;
}
