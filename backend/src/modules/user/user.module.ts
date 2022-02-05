import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';

import { userStoreProvider } from './user-store/user.store.provider';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [userStoreProvider],
  exports: [userStoreProvider],
})
export class UserModule {}
