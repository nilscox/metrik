import { FactoryProvider } from '@nestjs/common';
import { Kysely } from 'kysely';

import { Database } from '~/sql/database';

import { ConfigPort } from '../config';
import { Logger } from '../logger';

import { createDatabaseConnection } from './create-database-connection';

export const DatabaseToken = Symbol('DatabaseToken');

export const databaseProvider: FactoryProvider<Kysely<Database>> = {
  provide: DatabaseToken,
  inject: [ConfigPort, Logger],
  useFactory: (config: ConfigPort, logger) => {
    if (config.get('STORE') !== 'sql') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    }

    return createDatabaseConnection(
      config.get('DATABASE_FILENAME'),
      logger,
      config.get('DATABASE_LOGS') === 'true',
    );
  },
};
