import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { GeneratorModule } from '~/common/generator';
import { LoggerModule } from '~/common/logger';

import { ProjectService } from '../domain/project.service';
import { MetricConfigurationModule } from '../modules/metric-configuration';
import { MetricsSnapshotModule } from '../modules/metrics-snapshot';
import { ProjectAggregateModule } from '../project-aggregate';

import { ProjectController } from './project.controller';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    GeneratorModule,
    ProjectAggregateModule,
    MetricConfigurationModule,
    MetricsSnapshotModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
