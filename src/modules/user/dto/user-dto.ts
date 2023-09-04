import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../@types';

export class UserDto {
  @ApiProperty()
  id: string;
  password?: string;
  @ApiProperty()
  role: UserRole;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatarPath: string;
  @ApiProperty()
  confirmed: Boolean;
  @ApiProperty()
  data: Object;
}
