import { FactoryProvider } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { Database } from '~/sql/database';

import { ProjectStore } from './project.store';
import { ProjectStorePort } from './project.store.port';

export const projectStoreProvider: FactoryProvider<ProjectStorePort> = {
  provide: ProjectStore,
  inject: [DatabaseToken],
  useFactory(db: Database) {
    return new ProjectStore(db);
  },
};
