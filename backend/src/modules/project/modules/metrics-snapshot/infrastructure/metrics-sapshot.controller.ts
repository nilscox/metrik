import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IsAuthenticated } from '~/modules/authorization';

import { DuplicatedMetricError } from '../../../domain/duplicated-metric.error';
import { InvalidMetricValueTypeError } from '../../../domain/invalid-metric-value-type.error';
import { UnknownMetricLabelError } from '../../../domain/unknown-metric-label.error';
import { MetricsSnapshotService } from '../domain/metrics-snapshot.service';

import { CreateMetricsSnapshotDto } from './create-metrics-snapshot.dto';

@Controller('project/:id')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class MetricsSnapshotController {
  constructor(private metricsSnapshotService: MetricsSnapshotService) {}

  @Post('metrics-snapshot')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createMetricsSnapshot(
    @Param('id') projectId: string,
    @Body() dto: CreateMetricsSnapshotDto,
  ) {
    try {
      await this.metricsSnapshotService.createMetricsSnapshot(
        projectId,
        dto.reference,
        dto.metrics,
      );
    } catch (error) {
      if (
        error instanceof InvalidMetricValueTypeError ||
        error instanceof UnknownMetricLabelError ||
        error instanceof DuplicatedMetricError
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
