import { Exclude } from 'class-transformer';

import { IUserDto } from '@dtos/authentication/IUserDto';
import { User } from '~/modules/user';

export class UserDto implements IUserDto {
  constructor(user: User) {
    Object.assign(this, user.getProps());
  }

  id!: string;
  email!: string;
  token!: string;

  @Exclude()
  hashedPassword!: string;
}
