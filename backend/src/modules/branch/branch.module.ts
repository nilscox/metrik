import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';

import { branchStoreProvider } from './persistence/branch.store.provider';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [branchStoreProvider],
  exports: [branchStoreProvider],
})
export class BranchModule {}
