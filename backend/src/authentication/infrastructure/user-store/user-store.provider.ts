import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '../../../common/config/config.port';
import { UserStore, UserStoreToken } from '../../domain/user.store';

import { FixtureUserStore } from './fixture-user.store';
import { InMemoryUserStore } from './in-memory-user.store';

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
