import { Expose } from 'class-transformer';

import { UserProps } from '../domain/user';

export class UserDto {
  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.token = props.token;
  }

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  token: string;
}
