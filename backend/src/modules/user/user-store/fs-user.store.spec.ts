import expect from 'expect';

import { StubFileSystemAdapter } from '~/common/file-system';

import { createUser } from '../domain/user';

import { FsUserStore } from './fs-user.store';

describe('FsUserStore', () => {
  const email = 'user@domain.tld';

  it('finds a user from its email', async () => {
    const user = createUser({ email });

    const fs = new StubFileSystemAdapter();
    const store = new FsUserStore(fs);

    fs.files.set('db.json', [user.props]);

    expect(await store.findByEmail(email)).toEqual(user);
  });

  it('returns undefined when no user is found by email', async () => {
    const fs = new StubFileSystemAdapter();
    const store = new FsUserStore(fs);

    expect(await store.findByEmail(email)).toBeUndefined();
  });

  it('creates an empty data store file if it does not exist', async () => {
    const fs = new StubFileSystemAdapter();
    const store = new FsUserStore(fs);

    await store.findByEmail(email);

    expect(fs.files.get('db.json')).toEqual([]);
  });
});
