import { createStoreProvider } from '~/utils/create-store-provider';

import { ProjectStore, ProjectStoreToken } from '../application/project.store';

import { InMemoryProjectStore } from './in-memory-project.store';
import { SqlProjectStore } from './sql-project.store';

export const projectStoreProvider = createStoreProvider<ProjectStore>(ProjectStoreToken, {
  inMemory: InMemoryProjectStore,
  sql: SqlProjectStore,
});
