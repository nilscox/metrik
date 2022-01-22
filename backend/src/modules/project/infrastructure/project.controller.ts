import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthenticatedUser } from '~/modules/authentication';
import { IsAuthenticated } from '~/modules/authorization';
import { User } from '~/modules/user';

import { MetricConfigurationLabelAlreadyExistsError } from '../domain/metric-configuration-label-already-exists.error';
import { ProjectService } from '../domain/project.service';

import { AddMetricConfigurationDto } from './add-metric-configuration.dto';
import { CreateProjectDto } from './create-project.dto';
import { ProjectDto } from './project.dto';

@Controller('project')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

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
}
