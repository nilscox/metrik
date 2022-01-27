import { Inject, Injectable } from '@nestjs/common';

import { GeneratorPort } from '~/common/generator';

import { ProjectStore, ProjectStoreToken } from '../project-aggregate';

import { Project } from './project';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    private readonly generator: GeneratorPort,
  ) {}

  async findProjectById(projectId: string): Promise<Project | undefined> {
    return this.projectStore.findById(projectId);
  }

  async createNewProject(name: string, defaultBranch: string): Promise<Project> {
    const project = new Project({
      id: await this.generator.generateId(),
      name,
      defaultBranch,
      metricsConfig: [],
      snapshots: [],
    });

    await this.projectStore.save(project);

    return project;
  }
}
