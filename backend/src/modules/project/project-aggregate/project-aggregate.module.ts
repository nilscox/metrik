import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';

import { projectStoreProvider } from './project-store/project-store.provider';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [projectStoreProvider],
  exports: [projectStoreProvider],
})
export class ProjectAggregateModule {}
