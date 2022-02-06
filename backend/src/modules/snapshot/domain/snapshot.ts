import { nanoid } from 'nanoid';

import { AggregateRoot } from '~/ddd/aggregate-root';
import { DateVO } from '~/ddd/date.value-object';
import { Branch, createBranch } from '~/modules/branch';
import { Metric } from '~/modules/metric';

import { CreateMetricValueProps, MetricValue } from './metric-value';

export type SnapshotProps = {
  id: string;
  branch: Branch;
  ref: string;
  date: DateVO;
  metrics: MetricValue[];
};

export type CreateSnapshotProps = {
  id: string;
  branch: Branch;
  ref: string;
  date: Date;
  metrics: CreateMetricValueProps[];
};

export class Snapshot extends AggregateRoot<SnapshotProps> {
  static create(props: CreateSnapshotProps) {
    return new Snapshot({
      id: props.id,
      branch: props.branch,
      ref: props.ref,
      date: new DateVO(props.date),
      metrics: props.metrics.map(MetricValue.create),
    });
  }

  addMetricValue(metric: Metric, value: number) {
    const metricValue = MetricValue.create({
      id: nanoid(),
      metricId: metric.props.id,
      value,
    });

    this.props.metrics.push(metricValue);
  }

  validate(): void {
    this.props.date.validate();
  }
}

export const createSnapshot = (overrides: Partial<SnapshotProps> = {}) => {
  return new Snapshot({
    id: 'snapshotId',
    branch: createBranch(),
    ref: 'ref',
    date: new DateVO(new Date()),
    metrics: [],
    ...overrides,
  });
};
