import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/common/database';
import { GeneratorModule } from '~/common/generator';

import { ProjectModule } from '../project';

import { MetricService } from './application/metric.service';
import { MetricController } from './metric.controller';

@Module({
  imports: [GeneratorModule, DatabaseModule, ProjectModule],
  providers: [MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
