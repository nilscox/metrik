import { Expose } from 'class-transformer';

import { IUserDto } from '@dtos/authentication/IUserDto';
import { User } from '~/modules/user';

export class UserDto implements IUserDto {
  constructor(user: User) {
    Object.assign(this, user.props);
  }

  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  token!: string;
}
