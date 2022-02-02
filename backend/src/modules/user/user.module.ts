import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';

import { UserOrmEntity } from './user-store/user.orm-entity';
import { userStoreProvider } from './user-store/user.store.provider';

@Module({
  imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [userStoreProvider],
  exports: [userStoreProvider],
})
export class UserModule {}
