import { Inject, Injectable } from '@nestjs/common';

import { CreateProjectProps, Project } from '../domain/project';

import { ProjectStore, ProjectStoreToken } from './project.store';

@Injectable()
export class ProjectService {
  constructor(@Inject(ProjectStoreToken) private readonly projectStore: ProjectStore) {}

  async createProject(props: CreateProjectProps): Promise<Project> {
    const project = Project.create(props, []);

    project.validate();
    await this.projectStore.save(project);

    return project;
  }
}
