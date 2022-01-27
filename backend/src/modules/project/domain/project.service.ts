import { Inject, Injectable } from '@nestjs/common';

import { DatePort } from '~/common/date';
import { GeneratorPort } from '~/common/generator';

import { ProjectStore, ProjectStoreToken } from '../project-aggregate';

import { Metric, Project } from './project';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
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

  async createMetricsSnapshot(
    projectId: string,
    reference: string | undefined,
    metrics: Array<Metric>,
  ) {
    const project = await this.projectStore.findByIdOrFail(projectId);

    project.createMetricsSnapshot(
      await this.generator.generateId(),
      reference,
      this.date.now,
      metrics,
    );

    await this.projectStore.save(project);
  }
}
