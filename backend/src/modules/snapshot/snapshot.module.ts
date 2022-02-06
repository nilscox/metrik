import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';
import { DateModule } from '~/common/date';
import { GeneratorModule } from '~/common/generator';
import { BranchModule } from '~/modules/branch';
import { ProjectModule } from '~/modules/project';

import { SnapshotService } from './application/snapshot.service';
import { snapshotStoreProvider } from './persistence/snapshot.store.provider';
import { SnapshotController } from './snapshot.controller';

@Module({
  imports: [ConfigModule, GeneratorModule, DateModule, DatabaseModule, ProjectModule, BranchModule],
  controllers: [SnapshotController],
  providers: [snapshotStoreProvider, SnapshotService],
})
export class SnapshotModule {}
