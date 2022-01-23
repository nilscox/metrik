import { IMetricDto, IMetricsSnapshotDto, IProjectDto } from '@dtos/project/IProjectDto';

import { Metric, MetricsSnapshot, Project } from '../domain/project';

class MetricDto implements IMetricDto {
  constructor(metric: Metric) {
    Object.assign(this, metric);
  }

  label!: string;
  value!: number;
}

class MetricsSnapshotDto implements IMetricsSnapshotDto {
  constructor(snapshot: MetricsSnapshot) {
    const props = snapshot.getProps();

    Object.assign(this, {
      ...props,
      metrics: props.metrics.map((metric) => new MetricDto(metric)),
    });
  }

  id!: string;
  date!: string;
  metrics!: MetricDto[];
}

export class ProjectDto implements IProjectDto {
  constructor(project: Project) {
    const props = project.getProps();

    Object.assign(this, {
      ...props,
      metricsConfig: props.metricsConfig.map((config) => config.getProps()),
      snapshots: props.snapshots.map((snapshot) => new MetricsSnapshotDto(snapshot)),
    });
  }

  id!: string;
  name!: string;
  defaultBranch!: string;
  snapshots!: MetricsSnapshotDto[];
}
