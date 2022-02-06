import { FactoryProvider } from '@nestjs/common';
import { Connection } from 'typeorm';

import { ConfigPort } from '~/common/config';
import { Logger } from '~/common/logger';

import { DatabaseService } from './database.service';
import { NoopDatabaseService } from './noop-database.service';

export const databaseServiceProvider: FactoryProvider<DatabaseService> = {
  provide: DatabaseService,
  inject: [ConfigPort, Logger, Connection],
  useFactory: (config: ConfigPort, logger: Logger, connection: Connection) => {
    const store = config.get('STORE');

    if (store !== 'sql') {
      return new NoopDatabaseService(logger, connection);
    }

    return new DatabaseService(logger, connection);
  },
};
