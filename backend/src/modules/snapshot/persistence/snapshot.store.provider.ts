import { ClassProvider } from '@nestjs/common';

import { SnapshotStore, SnapshotStoreToken } from '../application/snapshot.store';

import { SqlSnapshotStore } from './sql-snapshot.store';

export const snapshotStoreProvider: ClassProvider<SnapshotStore> = {
  provide: SnapshotStoreToken,
  useClass: SqlSnapshotStore,
};
