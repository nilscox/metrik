import expect from 'expect';

import { StubCryptoAdapter } from '../../common/crypto/stub-crypto.adapter';
import { createUser } from '../domain/user';
import { InMemoryUserStore } from '../infrastructure/user-store/in-memory-user.store';

import { AuthenticationService } from './authentication.service';
import { InvalidCredentialsError } from './authentication-errors';

describe('AuthenticationService', () => {
  let crypto: StubCryptoAdapter;
  let userStore: InMemoryUserStore;
  let service: AuthenticationService;

  beforeEach(async () => {
    crypto = new StubCryptoAdapter();
    userStore = new InMemoryUserStore();
    service = new AuthenticationService(userStore, crypto);
  });

  describe('authenticate', () => {
    const email = 'user@email.tld';
    const password = 'password';

    it('creates a session as an existing user', async () => {
      const user = createUser({
        email: email,
        hashedPassword: '',
      });

      userStore.add(user.props);

      const loggedInUser = await service.authenticate(email, password);

      expect(loggedInUser.props.id).toEqual(user.props.id);

      expect(await userStore.findUserById(user.props.id)).toHaveProperty(
        'props.token',
        expect.any(String),
      );
    });

    it('discards a user who sent credentials that do not match any existing user', async () => {
      await expect(service.authenticate(email, password)).rejects.toThrow(
        InvalidCredentialsError,
      );
    });

    it('discards a user who sent invalid credentials', async () => {
      const user = createUser({ email });

      await userStore.add(user.props);

      await expect(service.authenticate(email, 'nope')).rejects.toThrow(
        InvalidCredentialsError,
      );
    });
  });
});
