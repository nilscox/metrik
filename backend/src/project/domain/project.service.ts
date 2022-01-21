import { Inject, Injectable } from '@nestjs/common';

import { GeneratorPort } from '../../common/generator/generator.port';

import { Project } from './project';
import { ProjectStore, ProjectStoreToken } from './project.store';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    private readonly generator: GeneratorPort,
  ) {}

  async createNewProject(
    name: string,
    defaultBranch: string,
  ): Promise<Project> {
    const project = new Project({
      id: await this.generator.generateId(),
      name,
      defaultBranch,
    });

    await this.projectStore.save(project);

    return project;
  }
}
