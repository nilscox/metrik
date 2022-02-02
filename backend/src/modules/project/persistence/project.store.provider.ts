import { ClassProvider } from '@nestjs/common';

import { ProjectStoreToken } from '../application/project.store';

import { SqlProjectStore } from './sql-project.store';

export const projectStoreProvider: ClassProvider = {
  provide: ProjectStoreToken,
  useClass: SqlProjectStore,
};
