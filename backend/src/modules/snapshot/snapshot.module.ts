import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '~/common/database';
import { DateModule } from '~/common/date';
import { GeneratorModule } from '~/common/generator';

import { SnapshotService } from './application/snapshot.service';
import { MetricValueOrmEntity } from './persistence/metric-value.orm-entity';
import { SnapshotOrmEntity } from './persistence/snapshot.orm-entity';
import { snapshotStoreProvider } from './persistence/snapshot.store.provider';
import { SnapshotController } from './snapshot.controller';

@Module({
  imports: [
    GeneratorModule,
    DateModule,
    DatabaseModule,
    TypeOrmModule.forFeature([SnapshotOrmEntity, MetricValueOrmEntity]),
  ],
  controllers: [SnapshotController],
  providers: [snapshotStoreProvider, SnapshotService],
})
export class SnapshotModule {}
