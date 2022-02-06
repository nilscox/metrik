import { createStoreProvider } from '~/utils/create-store-provider';

import { BranchStore, BranchStoreToken } from '../application/branche.store';

import { InMemoryBranchStore } from './in-memory-branch.store';
import { SqlBranchStore } from './sql-branch.store';

export const branchStoreProvider = createStoreProvider<BranchStore>(BranchStoreToken, {
  inMemory: InMemoryBranchStore,
  sql: SqlBranchStore,
});
