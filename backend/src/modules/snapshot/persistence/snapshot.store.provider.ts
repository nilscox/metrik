import { createStoreProvider } from '~/utils/create-store-provider';

import { SnapshotStore, SnapshotStoreToken } from '../application/snapshot.store';

import { InMemorySnapshotStore } from './in-memory-snapshot.store';
import { SqlSnapshotStore } from './sql-snapshot.store';

export const snapshotStoreProvider = createStoreProvider<SnapshotStore>(SnapshotStoreToken, {
  inMemory: InMemorySnapshotStore,
  sql: SqlSnapshotStore,
});
