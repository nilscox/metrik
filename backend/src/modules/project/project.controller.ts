import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { GeneratorPort } from '~/common/generator';

import { IsAuthenticated } from '../authorization';

import { ProjectService } from './application/project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectDto } from './dtos/project.dto';

@Controller('project')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProjectController {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly projectService: ProjectService,
  ) {}

  @Get(':id')
  async getProject(@Param('id') projectId: string): Promise<ProjectDto> {
    try {
      return new ProjectDto(await this.projectService.findById(projectId));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto): Promise<ProjectDto> {
    const project = await this.projectService.createProject({
      id: await this.generator.generateId(),
      ...dto,
    });

    return new ProjectDto(project);
  }
}
