import { nanoid } from 'nanoid';

import { AggregateRoot } from '~/ddd/aggregate-root';
import { DateVO } from '~/ddd/date.value-object';
import { Metric } from '~/modules/metric/domain/metric';
import { BranchName } from '~/modules/project/domain/branch-name';

import { CreateMetricValueProps, MetricValue } from './metric-value';

export type SnapshotProps = {
  id: string;
  branch: BranchName;
  ref: string;
  date: DateVO;
  projectId: string;
  metrics: MetricValue[];
};

export type CreateSnapshotProps = {
  id: string;
  branch: string;
  ref: string;
  date: Date;
  projectId: string;
  metrics: CreateMetricValueProps[];
};

export class Snapshot extends AggregateRoot<SnapshotProps> {
  static create(props: CreateSnapshotProps) {
    return new Snapshot({
      id: props.id,
      branch: new BranchName(props.branch),
      ref: props.ref,
      date: new DateVO(props.date),
      projectId: props.projectId,
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
    this.props.branch.validate();
    this.props.date.validate();
  }
}
