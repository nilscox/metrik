import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
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

import { MetricConfigurationService } from '../domain/metric-configuration.service';
import { MetricConfigurationLabelAlreadyExistsError } from '../domain/metric-configuration-label-already-exists.error';

import { AddMetricConfigurationDto } from './add-metric-configuration.dto';

@Controller('project')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class MetricConfigurationController {
  constructor(private readonly metricConfigurationService: MetricConfigurationService) {}

  @Post(':id/metric')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addMetricConfiguration(
    @Param('id') projectId: string,
    @Body() dto: AddMetricConfigurationDto,
  ) {
    try {
      await this.metricConfigurationService.addMetricConfiguration(
        projectId,
        dto.label,
        dto.unit,
        dto.type,
      );
    } catch (error) {
      if (error instanceof MetricConfigurationLabelAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
