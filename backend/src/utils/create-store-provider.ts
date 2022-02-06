import { FactoryProvider } from '@nestjs/common';
import { Connection } from 'typeorm';

import { ConfigPort } from '~/common/config';
import { EntityStore } from '~/sql/base-store';

type Stores<T> = {
  inMemory: new () => T;
  sql: new (connection: Connection) => T;
};

export const createStoreProvider = <T extends EntityStore<unknown>>(
  token: symbol,
  stores: Stores<T>,
): FactoryProvider<T> => ({
  provide: token,
  inject: [ConfigPort, Connection],
  useFactory: (config: ConfigPort, connection: Connection) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new stores.inMemory();

      case 'sql':
        return new stores.sql(connection);

      default:
        throw new Error(`invalid store value "${store}"`);
    }
  },
});
