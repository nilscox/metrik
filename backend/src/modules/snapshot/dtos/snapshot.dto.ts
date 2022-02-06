import { Expose } from 'class-transformer';

import { IMetricValueDto, ISnapshotDto } from '@shared/dtos/project/ISnapshotDto';

import { MetricValue } from '../domain/metric-value';
import { Snapshot } from '../domain/snapshot';

export class MetricValueDto implements IMetricValueDto {
  constructor(value: MetricValue) {
    this.metricId = value.props.metricId;
    this.value = value.props.value;
  }

  @Expose()
  metricId: string;

  @Expose()
  value: number;
}

export class SnapshotDto implements ISnapshotDto {
  constructor(snapshot: Snapshot) {
    this.id = snapshot.props.id;
    this.branch = snapshot.props.branch.props.name.value;
    this.ref = snapshot.props.ref;
    this.date = snapshot.props.date.toString();
    this.metrics = snapshot.props.metrics.map((value) => new MetricValueDto(value));
  }

  @Expose()
  id: string;

  @Expose()
  branch: string;

  @Expose()
  ref: string;

  @Expose()
  date: string;

  @Expose()
  metrics: Array<MetricValueDto>;
}
