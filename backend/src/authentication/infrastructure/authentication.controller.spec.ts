import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { Credentials } from '../domain/credentials';
import { createUser } from '../domain/user';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationModule } from './authentication.module';
import { InMemoryUserStore } from './user-store/in-memory-user.store';
import { UserStoreToken } from './user-store/user-store-token';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let userStore: InMemoryUserStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
    })
      .overrideProvider(UserStoreToken)
      .useClass(InMemoryUserStore)
      .compile();

    controller = module.get(AuthenticationController);
    userStore = module.get(UserStoreToken);
  });

  describe('login', () => {
    const credentials: Credentials = {
      email: 'user@email.tld',
      password: 'password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$UBasAHZfjDYLOZnt5qikDe/8rcV2douMhpvFrfweKickmZR6GGgwi';

    it('creates a session as an existing user', async () => {
      const user = createUser({
        email: credentials.email,
        hashedPassword,
      });

      userStore.add(user);

      const loggedInUser = await controller.login(credentials);

      expect(loggedInUser).toEqual({
        id: user.props.id,
        email: credentials.email,
        token: expect.any(String),
      });

      expect(await userStore.findUserById(user.props.id)).toHaveProperty(
        'props.token',
        expect.any(String),
      );
    });

    it('discards a user who sent credentials that do not match any existing user', async () => {
      await expect(controller.login(credentials)).rejects.toThrow(
        'invalid credentials',
      );
    });

    it('prevents a user who is already logged in to log in again', async () => {
      const user = createUser();

      userStore.add(user);

      await expect(controller.login(credentials, user)).rejects.toThrow(
        'already authenticated',
      );
    });
  });
});
