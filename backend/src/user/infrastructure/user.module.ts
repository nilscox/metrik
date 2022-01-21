import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';

import { userStoreProvider } from './user-store/user-store.provider';

@Module({
  imports: [ConfigModule],
  providers: [userStoreProvider],
  exports: [userStoreProvider],
})
export class UserModule {}
