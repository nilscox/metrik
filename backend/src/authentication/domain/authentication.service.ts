import { Inject, Injectable } from '@nestjs/common';

import { CryptoPort } from '../../common/crypto/crypto.port';
import { GeneratorPort } from '../../common/generator/generator.port';

import { InvalidCredentialsError } from './authentication-errors';
import { User } from './user';
import { UserStore, UserStoreToken } from './user.store';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(UserStoreToken) private readonly userStore: UserStore,
    private readonly crypto: CryptoPort,
    private readonly generator: GeneratorPort,
  ) {}

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.userStore.findUserByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const result = await user.checkPassword(password, this.crypto);

    if (!result) {
      throw new InvalidCredentialsError();
    }

    await user.generateToken(this.generator);

    await this.userStore.saveUser(user);

    return user;
  }
}
