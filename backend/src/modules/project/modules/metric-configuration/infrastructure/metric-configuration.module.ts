import { Module } from '@nestjs/common';

import { ProjectAggregateModule } from '../../../project-aggregate';
import { MetricConfigurationService } from '../domain/metric-configuration.service';

import { MetricConfigurationController } from './metric-configuration.controller';

@Module({
  imports: [ProjectAggregateModule],
  controllers: [MetricConfigurationController],
  providers: [MetricConfigurationService],
})
export class MetricConfigurationModule {}
