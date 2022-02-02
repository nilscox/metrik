import { Injectable } from '@nestjs/common';

import { ProjectStore } from '~/modules/project/persistence/project.store';

import { CreateMetricProps, Metric } from '../domain/metric';
import { MetricStore } from '../persistence/metric.store';

@Injectable()
export class MetricService {
  constructor(
    private readonly projectStore: ProjectStore,
    private readonly metricStore: MetricStore,
  ) {}

  async createMetric(props: CreateMetricProps) {
    await this.projectStore.findByIdOrFail(props.projectId);
    const metric = Metric.create(props);

    metric.validate();
    await this.metricStore.save(metric);

    return metric;
  }
}
