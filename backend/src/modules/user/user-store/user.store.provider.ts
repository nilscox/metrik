import { ClassProvider } from '@nestjs/common';

import { SqlUserStore } from './sql-user.store';
import { UserStore, UserStoreToken } from './user.store';

export const userStoreProvider: ClassProvider<UserStore> = {
  provide: UserStoreToken,
  useClass: SqlUserStore,
};
