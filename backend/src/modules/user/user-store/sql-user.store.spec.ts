import { Test } from '@nestjs/testing';
import expect from 'expect';

import { DatabaseService } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';

import { createUser, User } from '../domain/user';
import { UserModule } from '../user.module';

import { UserStore, UserStoreToken } from './user.store';

describe('SqlUserStore', () => {
  let database: DatabaseService;
  let store: UserStore;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    database = moduleRef.get(DatabaseService);
    store = moduleRef.get(UserStoreToken);

    await moduleRef.get(DatabaseService).runMigrations();
  });

  after(async () => {
    await database?.closeConnection();
  });

  beforeEach(async () => {
    await database.clear();
  });

  const insert = async (user: User) => {
    await store.save(user);
    return user;
  };

  const find = async (userId: string) => {
    return store.findById(userId);
  };

  describe('findByEmail', () => {
    it('finds a user from its email', async () => {
      const email = 'user@domain.tld';
      const user = await insert(createUser({ email }));

      const dbUser = await store.findByEmail(email);

      expect(dbUser).toEqual(user);
    });

    it('does not find any user from an email', async () => {
      expect(await store.findByEmail('user@domain.tld')).toBeUndefined();
    });
  });

  describe('findByToken', () => {
    it('finds a user from a token', async () => {
      const token = 'strtok_r';
      const user = await insert(createUser({ token }));

      const dbUser = await store.findByToken(token);

      expect(dbUser).toEqual(user);
    });

    it('does not find any user from a token', async () => {
      expect(await store.findByToken('strtok_r')).toBeUndefined();
    });
  });

  describe('save', () => {
    it('creates and updates a user', async () => {
      const userId = 'user-id';
      const user = createUser({ id: userId });

      await store.save(user);

      expect(await find(userId)).toEqual(user);

      user.props.token = 'strtok_r';

      await store.save(user);

      expect(await find(userId)).toEqual(user);
    });
  });
});
