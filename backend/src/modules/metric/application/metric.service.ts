import { Inject, Injectable } from '@nestjs/common';

import { ProjectStore, ProjectStoreToken } from '~/modules/project';

import { CreateMetricProps, Metric } from '../domain/metric';

@Injectable()
export class MetricService {
  constructor(@Inject(ProjectStoreToken) private readonly projectStore: ProjectStore) {}

  async createMetric(props: CreateMetricProps) {
    const project = await this.projectStore.findByIdOrFail(props.projectId);
    const metric = Metric.create(props);

    project.addMetric(metric);

    project.validate();
    await this.projectStore.save(project);

    return metric;
  }
}
