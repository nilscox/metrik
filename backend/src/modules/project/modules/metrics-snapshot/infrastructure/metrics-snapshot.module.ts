import { Module } from '@nestjs/common';

import { DateModule } from '~/common/date';
import { GeneratorModule } from '~/common/generator';

import { ProjectAggregateModule } from '../../../project-aggregate';
import { MetricsSnapshotService } from '../domain/metrics-snapshot.service';

import { MetricsSnapshotController } from './metrics-sapshot.controller';

@Module({
  imports: [DateModule, GeneratorModule, ProjectAggregateModule],
  controllers: [MetricsSnapshotController],
  providers: [MetricsSnapshotService],
})
export class MetricsSnapshotModule {}
