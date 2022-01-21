import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
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
}
