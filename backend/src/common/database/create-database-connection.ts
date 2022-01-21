import { Kysely, SqliteDialect } from 'kysely';

import { DatabaseDefinition } from '~/sql/database';

export const createDatabaseConnection = (filename = ':memory:') => {
  return new Kysely<DatabaseDefinition>({
    dialect: new SqliteDialect({
      databasePath: filename,
    }),
  });
};
