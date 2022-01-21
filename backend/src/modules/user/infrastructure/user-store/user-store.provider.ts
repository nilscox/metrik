import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '~/common/config';
import { DatabaseToken } from '~/common/database/database.provider';
import { Database } from '~/sql/database';

import { UserStore, UserStoreToken } from '../../domain/user.store';

import { FixtureUserStore } from './fixture-user.store';
import { InMemoryUserStore } from './in-memory-user.store';
import { SqlUserStore } from './sql-user.store';

export const userStoreProvider: FactoryProvider<UserStore> = {
  provide: UserStoreToken,
  inject: [ConfigPort, DatabaseToken],
  useFactory: (config: ConfigPort, db: Database) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new InMemoryUserStore();

      case 'fixture':
        return new FixtureUserStore();

      case 'sql':
        return new SqlUserStore(db);

      default:
        throw new Error(`invalid STORE value '${store}'`);
    }
  },
};
