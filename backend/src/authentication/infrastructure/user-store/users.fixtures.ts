import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '../../../common/config/config.port';
import { UserStore } from '../../domain/user.store';

import { InMemoryUserStore } from './in-memory-user.store';
import { UserStoreToken } from './user-store-token';

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

      default:
        throw new Error(`invalid USER_STORE value '${store}'`);
    }
  },
};
