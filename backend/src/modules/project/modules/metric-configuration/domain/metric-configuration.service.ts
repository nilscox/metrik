import { Inject, Injectable } from '@nestjs/common';

import { ProjectStore, ProjectStoreToken } from '../../../project-aggregate';

@Injectable()
export class MetricConfigurationService {
  constructor(@Inject(ProjectStoreToken) private readonly projectStore: ProjectStore) {}

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
}
