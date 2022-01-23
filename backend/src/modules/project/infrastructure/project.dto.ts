import { Expose } from 'class-transformer';

import {
  IMetricConfigDto,
  IMetricDto,
  IMetricsSnapshotDto,
  IProjectDto,
} from '@dtos/project/IProjectDto';

import { Metric, MetricConfiguration, MetricsSnapshot, Project } from '../domain/project';

class MetricDto implements IMetricDto {
  constructor(metric: Metric) {
    Object.assign(this, metric);
  }

  @Expose()
  label!: string;

  @Expose()
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

  @Expose()
  id!: string;

  @Expose()
  reference!: string;

  @Expose()
  date!: string;

  @Expose()
  metrics!: MetricDto[];
}

export class MetricConfigDto implements IMetricConfigDto {
  constructor(config: MetricConfiguration) {
    const props = config.getProps();

    Object.assign(this, props);
  }

  @Expose()
  label!: string;

  @Expose()
  type!: string;

  @Expose()
  unit!: string;
}

export class ProjectDto implements IProjectDto {
  constructor(project: Project) {
    const props = project.getProps();

    Object.assign(this, {
      ...props,
      metricsConfig: props.metricsConfig.map((config) => new MetricConfigDto(config)),
      snapshots: props.snapshots.map((snapshot) => new MetricsSnapshotDto(snapshot)),
    });
  }

  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  defaultBranch!: string;

  @Expose()
  metricsConfig!: MetricConfigDto[];

  @Expose()
  snapshots!: MetricsSnapshotDto[];
}
