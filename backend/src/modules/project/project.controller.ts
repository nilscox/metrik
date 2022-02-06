import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IsAuthenticated } from '~/modules/authorization';

import { ProjectService } from './application/project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectDto } from './dtos/project.dto';

@Controller('project')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':id')
  async getProject(@Param('id') projectId: string): Promise<ProjectDto> {
    const project = await this.projectService.findById(projectId);
    const branches = await this.projectService.findBranches(projectId);

    return new ProjectDto(project, branches);
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto): Promise<ProjectDto> {
    const project = await this.projectService.createProject(dto);
    const branches = await this.projectService.findBranches(project.props.id);

    return new ProjectDto(project, branches);
  }
}
