import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/common/database';
import { GeneratorModule } from '~/common/generator';

import { ProjectModule } from '../project/project.module';

import { MetricService } from './application/metric.service';
import { MetricController } from './metric.controller';
import { metricStoreProvider } from './persistence/metric-store.provider';

@Module({
  imports: [GeneratorModule, DatabaseModule, ProjectModule],
  providers: [metricStoreProvider, MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
