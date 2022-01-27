import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '~/common/config';
import { DatabaseToken } from '~/common/database/database.provider';
import { Database } from '~/sql/database';

import { FixtureProjectStore } from './fixture-project.store';
import { InMemoryProjectStore } from './in-memory-project.store';
import { ProjectStore, ProjectStoreToken } from './project.store';
import { SqlProjectStore } from './sql-project.store';

export const projectStoreProvider: FactoryProvider<ProjectStore> = {
  provide: ProjectStoreToken,
  inject: [ConfigPort, DatabaseToken],
  useFactory: (config: ConfigPort, db: Database) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new InMemoryProjectStore();

      case 'fixture':
        return new FixtureProjectStore();

      case 'sql':
        return new SqlProjectStore(db);

      default:
        throw new Error(`invalid STORE value '${store}'`);
    }
  },
};
