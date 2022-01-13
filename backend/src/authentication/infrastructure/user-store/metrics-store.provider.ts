import { FactoryProvider } from '@nestjs/common';

import { Config } from '../../../common/config/config.interface';
import { ConfigToken } from '../../../common/config/config.token';
import { UserStore } from '../../domain/user.store';

import { InMemoryUserStore } from './in-memory-user.store';
import { UserStoreToken } from './user-store-token';

export const userStoreProvider: FactoryProvider<UserStore> = {
  provide: UserStoreToken,
  inject: [ConfigToken],
  useFactory: (config: Config) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new InMemoryUserStore();

      default:
        throw new Error(`invalid USER_STORE value '${store}'`);
    }
  },
};
