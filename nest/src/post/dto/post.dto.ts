import { UserDto } from '../../users/dto/user.dto';

export class PostDto {
  id: number;
  title: string;
  content: string;
  url: string;
  user: UserDto;
}
