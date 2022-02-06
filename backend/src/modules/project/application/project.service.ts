import { Inject, Injectable } from '@nestjs/common';

import { Branch, BranchStore, BranchStoreToken } from '~/modules/branch';

import { CreateProjectProps, Project } from '../domain/project';

import { ProjectStore, ProjectStoreToken } from './project.store';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    @Inject(BranchStoreToken) private readonly branchStore: BranchStore,
  ) {}

  async findById(projectId: string): Promise<Project> {
    return this.projectStore.findByIdOrFail(projectId);
  }

  async findBranches(projectId: string): Promise<Branch[]> {
    return this.branchStore.findAllForProjectId(projectId);
  }

  async createProject(props: CreateProjectProps): Promise<Project> {
    const project = Project.create(props);

    await this.projectStore.insert(project);

    return project;
  }
}
