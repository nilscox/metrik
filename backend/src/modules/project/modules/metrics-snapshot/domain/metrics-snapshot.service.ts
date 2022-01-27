import { Inject, Injectable } from '@nestjs/common';

import { DatePort } from '~/common/date';
import { GeneratorPort } from '~/common/generator';

import { Metric } from '../../../domain/project';
import { ProjectStore, ProjectStoreToken } from '../../../project-aggregate';

@Injectable()
export class MetricsSnapshotService {
  constructor(
    @Inject(ProjectStoreToken) private readonly projectStore: ProjectStore,
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
  ) {}

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
