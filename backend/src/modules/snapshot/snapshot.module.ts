import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/common/database';
import { DateModule } from '~/common/date';
import { GeneratorModule } from '~/common/generator';

import { SnapshotService } from './application/snapshot.service';
import { SnapshotStore } from './persistence/snapshot.store';
import { SnapshotController } from './snapshot.controller';

@Module({
  imports: [GeneratorModule, DateModule, DatabaseModule],
  controllers: [SnapshotController],
  providers: [SnapshotStore, SnapshotService],
})
export class SnapshotModule {}
