import expect from 'expect';

import { StubCryptoAdapter } from '~/common/crypto';
import { StubGeneratorAdapter } from '~/common/generator';
import { createUser, InMemoryUserStore, User } from '~/modules/user';

import { EmailAlreadyExistsError } from '../domain/errors/email-already-exists.error';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error';

import { AuthenticationService } from './authentication.service';

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

  const email = 'user@email.tld';
  const password = 'password';

  describe('createUser', () => {
    it('creates a new user', async () => {
      await service.createUser(email, password);

      const savedUser = await userStore.findByEmail(email);

      const expectedUser = new User({
        id: 'generated-id',
        email,
        hashedPassword: 'password-encrypted',
        token: 'generated-token',
      });

      expect(savedUser).toBeDefined();
      expect(savedUser).toEqual(expectedUser);
    });

    it('prevents to create a user with an already existing email', async () => {
      await userStore.save(createUser({ email }));

      await expect(service.createUser(email, password)).rejects.toThrow(EmailAlreadyExistsError);
    });
  });

  describe('authenticate', () => {
    it('creates a session as an existing user', async () => {
      const user = createUser({ email: email });

      await userStore.save(user);

      const loggedInUser = await service.authenticate(email, password);

      expect(loggedInUser.equals(user)).toBe(true);

      expect(await userStore.findById(user.id)).toHaveProperty('props.token', 'generated-token');
    });

    it('discards a user who sent credentials that do not match any existing user', async () => {
      await expect(service.authenticate(email, password)).rejects.toThrow(InvalidCredentialsError);
    });

    it('discards a user who sent invalid credentials', async () => {
      const user = createUser({ email });

      await userStore.save(user);

      await expect(service.authenticate(email, 'nope')).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
