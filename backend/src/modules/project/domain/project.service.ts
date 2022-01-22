import { Inject, Injectable } from '@nestjs/common';

import { DatePort } from '~/common/date/date.port';
import { GeneratorPort } from '~/common/generator';

import { Metric, Project } from './project';
import { ProjectStore, ProjectStoreToken } from './project.store';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
  ) {}

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

  async addMetricConfiguration(
    projectId: string,
    label: string,
    unit: string,
    type: string,
  ): Promise<void> {
    const project = await this.projectStore.findByIdOrFail(projectId);

    project.addMetricConfig(label, unit, type);

    await this.projectStore.save(project);
  }

  async createMetricsSnapshot(projectId: string, metrics: Array<Metric>) {
    const project = await this.projectStore.findByIdOrFail(projectId);

    project.createMetricsSnapshot(await this.generator.generateId(), this.date.now, metrics);

    await this.projectStore.save(project);
  }
}
