import { IProjectDto } from '@dtos/project/IProjectDto';

import { Project } from '../domain/project';

export class ProjectDto implements IProjectDto {
  constructor(project: Project) {
    Object.assign(this, project.getProps());
  }

  id!: string;
  name!: string;
  defaultBranch!: string;
}
