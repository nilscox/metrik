import { FactoryProvider } from '@nestjs/common';

import {
  UserStore,
  UserStoreToken,
} from '../../../authentication/domain/user.store';
import { ConfigPort } from '../../../common/config/config.port';

import { FixtureUserStore } from './fixture-user.store';
import { InMemoryUserStore } from './in-memory-user.store';
import { SqlUserStore } from './sql-user.store';

export const userStoreProvider: FactoryProvider<UserStore> = {
  provide: UserStoreToken,
  inject: [ConfigPort],
  useFactory: (config: ConfigPort) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new InMemoryUserStore();

      case 'fixture':
        return new FixtureUserStore();

      case 'sql':
        return new SqlUserStore();

      default:
        throw new Error(`invalid STORE value '${store}'`);
    }
  },
};
