import expect from 'expect';

import db from '~/sql/database';

import { createUser, User } from '../../domain/user';

import { SqlUserStore } from './sql-user.store';

describe('SqlUserStore', () => {
  let store: SqlUserStore;

  beforeEach(async () => {
    store = new SqlUserStore();

    await db.deleteFrom('user').execute();
  });

  const insert = async (user: User) => {
    await db.insertInto('user').values(user.getProps()).execute();
    return user;
  };

  const find = async (userId: string) => {
    return db.selectFrom('user').selectAll().where('id', '=', userId).executeTakeFirstOrThrow();
  };

  it('finds a user from its email', async () => {
    const email = 'user@domain.tld';
    const user = await insert(createUser({ email }));

    const dbUser = await store.findUserByEmail(email);

    expect(dbUser).toEqual(user);
  });

  it('finds a user from a token', async () => {
    const token = 'some-token';
    const user = await insert(createUser({ token }));

    const dbUser = await store.findUserByToken(token);

    expect(dbUser).toEqual(user);
  });

  it('creates a new user', async () => {
    const userId = 'user-id';
    const user = createUser({ id: userId });

    await store.saveUser(user);

    expect(await find(userId)).toEqual({ token: null, ...user.getProps() });
  });

  it('updates an existing user', async () => {
    const userId = 'user-id';
    const user = await insert(createUser({ id: userId, token: 'token' }));

    // @ts-expect-error we don't want to invoke the domain code
    // so we need to access a private property
    user.props.token = 'new-token';

    await store.saveUser(user);

    expect(await find(userId)).toEqual(user.getProps());
  });
});
