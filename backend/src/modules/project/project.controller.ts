import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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

  @Post()
  async createProject(@Body() dto: CreateProjectDto): Promise<ProjectDto> {
    const project = await this.projectService.createProject({
      id: await this.generator.generateId(),
      ...dto,
    });

    return new ProjectDto(project);
  }
}
