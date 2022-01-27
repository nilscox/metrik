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

import { AuthenticatedUser } from '~/modules/authentication';
import { IsAuthenticated } from '~/modules/authorization';
import { User } from '~/modules/user';

import { ProjectService } from '../domain/project.service';

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
}
