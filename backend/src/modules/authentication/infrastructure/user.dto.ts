import { Exclude } from 'class-transformer';

import { User } from '~/modules/user';

export class UserDto {
  constructor(user: User) {
    Object.assign(this, user.getProps());
  }

  id!: string;
  email!: string;
  token!: string;

  @Exclude()
  hashedPassword!: string;
}
