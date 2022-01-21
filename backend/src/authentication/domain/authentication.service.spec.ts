import expect from 'expect';

import { StubCryptoAdapter } from '../../common/crypto/stub-crypto.adapter';
import { StubGeneratorAdapter } from '../../common/generator/stub-generator.adapter';
import { InMemoryUserStore } from '../../user/infrastructure/user-store/in-memory-user.store';
import { createUser } from '../domain/user';

import { AuthenticationService } from './authentication.service';
import { InvalidCredentialsError } from './authentication-errors';

describe('AuthenticationService', () => {
  let crypto: StubCryptoAdapter;
  let userStore: InMemoryUserStore;
  let generator: StubGeneratorAdapter;
  let service: AuthenticationService;

  beforeEach(async () => {
    crypto = new StubCryptoAdapter();
    userStore = new InMemoryUserStore();
    generator = new StubGeneratorAdapter();
    service = new AuthenticationService(userStore, crypto, generator);
  });

  describe('authenticate', () => {
    const email = 'user@email.tld';
    const password = 'password';

    it('creates a session as an existing user', async () => {
      const user = createUser({ email: email });

      await userStore.saveUser(user);

      const loggedInUser = await service.authenticate(email, password);

      expect(loggedInUser.equals(user)).toBe(true);

      expect(await userStore.findUserById(user.id)).toHaveProperty(
        'props.token',
        'generated-token',
      );
    });

    it('discards a user who sent credentials that do not match any existing user', async () => {
      await expect(service.authenticate(email, password)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it('discards a user who sent invalid credentials', async () => {
      const user = createUser({ email });

      await userStore.saveUser(user);

      await expect(service.authenticate(email, 'nope')).rejects.toThrow(
        InvalidCredentialsError,
      );
    });
  });
});
