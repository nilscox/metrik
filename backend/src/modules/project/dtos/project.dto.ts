import { Expose } from 'class-transformer';

import { IProjectDto } from '@dtos/project/IProjectDto';

import { Project } from '../domain/project';

export class ProjectDto implements IProjectDto {
  constructor(project: Project) {
    const props = project.props;

    this.id = props.id;
    this.name = props.name.value;
    this.defaultBranch = props.defaultBranch.value;
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  defaultBranch: string;
}
