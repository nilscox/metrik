import { Inject, Injectable } from '@nestjs/common';

import { CryptoPort } from '~/common/crypto';
import { GeneratorPort } from '~/common/generator';
import { User, UserStore, UserStoreToken } from '~/modules/user';

import { EmailAlreadyExistsError, InvalidCredentialsError } from './authentication-errors';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(UserStoreToken) private readonly userStore: UserStore,
    private readonly crypto: CryptoPort,
    private readonly generator: GeneratorPort,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const existingEmailUser = await this.userStore.findUserByEmail(email);

    if (existingEmailUser) {
      throw new EmailAlreadyExistsError(email);
    }

    const hashedPassword = await this.crypto.encrypt(password);

    const user = new User({
      id: await this.generator.generateId(),
      email,
      hashedPassword,
    });

    await user.generateToken(this.generator);

    await this.userStore.saveUser(user);

    return user;
  }

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

  async revokeAuthentication(user: User): Promise<void> {
    user.unsetToken();

    await this.userStore.saveUser(user);
  }
}
