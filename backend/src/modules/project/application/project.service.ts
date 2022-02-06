import { Inject, Injectable } from '@nestjs/common';

import { GeneratorPort } from '~/common/generator';
import { Branch, BranchStore, BranchStoreToken } from '~/modules/branch';

import { Project } from '../domain/project';

import { ProjectStore, ProjectStoreToken } from './project.store';

type CreateProjectCommand = {
  name: string;
  defaultBranch?: string;
};

@Injectable()
export class ProjectService {
  constructor(
    private readonly generator: GeneratorPort,
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    @Inject(BranchStoreToken) private readonly branchStore: BranchStore,
  ) {}

  async findById(projectId: string): Promise<Project> {
    return this.projectStore.findByIdOrFail(projectId);
  }

  async findBranches(projectId: string): Promise<Branch[]> {
    return this.branchStore.findAllForProjectId(projectId);
  }

  async createProject(command: CreateProjectCommand): Promise<Project> {
    const projectId = this.generator.generateId();

    const project = Project.create({
      id: projectId,
      name: command.name,
      defaultBranch: {
        id: this.generator.generateId(),
        projectId,
        name: command.defaultBranch,
      },
    });

    await this.projectStore.insert(project);

    return project;
  }
}
