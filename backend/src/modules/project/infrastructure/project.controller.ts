import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthenticatedUser } from '~/modules/authentication';
import { IsAuthenticated } from '~/modules/authorization';
import { User } from '~/modules/user';

import { DuplicatedMetricError } from '../domain/duplicated-metric.error';
import { InvalidMetricValueTypeError } from '../domain/invalid-metric-value-type.error';
import { MetricConfigurationLabelAlreadyExistsError } from '../domain/metric-configuration-label-already-exists.error';
import { ProjectService } from '../domain/project.service';
import { UnknownMetricLabelError } from '../domain/unknown-metric-label.error';

import { AddMetricConfigurationDto } from './add-metric-configuration.dto';
import { CreateMetricsSnapshotDto } from './create-metrics-snapshot.dto';
import { CreateProjectDto } from './create-project.dto';
import { ProjectDto } from './project.dto';

@Controller('project')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get(':id')
  async getProject(@Param('id') id: string): Promise<ProjectDto> {
    const project = await this.projectService.findProjectById(id);

    if (!project) {
      throw new NotFoundException('project not found', `project with id "${id}" does not exist`);
    }

    return new ProjectDto(project);
  }

  @Post()
  async createProject(
    @AuthenticatedUser() user: User,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectDto> {
    const project = await this.projectService.createNewProject(dto.name, dto.defaultBranch);

    return new ProjectDto(project);
  }

  @Post(':id/metric')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addMetricConfiguration(
    @Param('id') projectId: string,
    @Body() dto: AddMetricConfigurationDto,
  ) {
    try {
      await this.projectService.addMetricConfiguration(projectId, dto.label, dto.unit, dto.type);
    } catch (error) {
      if (error instanceof MetricConfigurationLabelAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post(':id/metrics-snapshot')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createMetricsSnapshot(
    @Param('id') projectId: string,
    @Body() dto: CreateMetricsSnapshotDto,
  ) {
    try {
      await this.projectService.createMetricsSnapshot(projectId, dto.reference, dto.metrics);
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
