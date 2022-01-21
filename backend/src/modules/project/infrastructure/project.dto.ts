import { Project } from '../domain/project';

export class ProjectDto {
  constructor(project: Project) {
    Object.assign(this, project.getProps());
  }

  id!: string;
  name!: string;
  defaultBranch!: string;
}
