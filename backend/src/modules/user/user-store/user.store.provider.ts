import { createStoreProvider } from '../../../utils/create-store-provider';

import { InMemoryUserStore } from './in-memory-user.store';
import { SqlUserStore } from './sql-user.store';
import { UserStore, UserStoreToken } from './user.store';

export const userStoreProvider = createStoreProvider<UserStore>(UserStoreToken, {
  inMemory: InMemoryUserStore,
  sql: SqlUserStore,
});
