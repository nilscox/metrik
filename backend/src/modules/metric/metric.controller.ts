import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GeneratorPort } from '~/common/generator';

import { IsAuthenticated } from '../authorization';

import { MetricService } from './application/metric.service';
import { CreateMetricDto } from './dtos/create-metric.dto';
import { MetricDto } from './dtos/metric.dto';

@Controller('project/:projectId/metric')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class MetricController {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly metricService: MetricService,
  ) {}

  @Post()
  async createMetric(
    @Param('projectId') projectId: string,
    @Body() dto: CreateMetricDto,
  ): Promise<MetricDto> {
    const metric = await this.metricService.createMetric({
      id: await this.generator.generateId(),
      projectId,
      ...dto,
    });

    return new MetricDto(metric);
  }
}
