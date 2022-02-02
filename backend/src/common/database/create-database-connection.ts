import { Kysely, Logger as KyselyLogger, SqliteDialect } from 'kysely';

import { DatabaseDefinition } from '~/sql/database';

import { Logger } from '../logger';

const createLogger = (logger: Logger): KyselyLogger => {
  return (event) => {
    if (event.level === 'query') {
      let i = 0;
      logger.log(event.query.sql.replace(/\?/g, () => `'${event.query.parameters[i++]}'`));
    }
  };
};

export const createDatabaseConnection = (
  filename = ':memory:',
  logger?: Logger,
  logs?: boolean,
) => {
  return new Kysely<DatabaseDefinition>({
    dialect: new SqliteDialect({
      databasePath: filename,
    }),
    log: logs && logger ? createLogger(logger) : undefined,
  });
};
