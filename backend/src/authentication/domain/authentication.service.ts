import { Inject, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import { InvalidCredentialsError } from './authentication-errors';
import { User } from './user';
import { UserStore, UserStoreToken } from './user.store';

export abstract class IdGenerator {
  abstract generateId(): string;
}

export abstract class Crypto {
  abstract compare(data: string, encrypted: string): Promise<boolean>;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(UserStoreToken) private readonly userStore: UserStore,
    private readonly crypto: Crypto,
  ) {}

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.userStore.findUserByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const result = await this.crypto.compare(
      password,
      user.props.hashedPassword,
    );

    if (!result) {
      throw new InvalidCredentialsError();
    }

    user.props.token = uuid.v4();

    await this.userStore.saveUser(user);

    return user;
  }
}
