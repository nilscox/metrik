import { AggregateRoot } from '~/ddd/aggregate-root';
import { DateVO } from '~/ddd/date.value-object';

import { CreateMetricValueProps, MetricValue } from './metric-value';

export type SnapshotProps = {
  id: string;
  date: DateVO;
  projectId: string;
  metrics: MetricValue[];
};

export type CreateSnapshotProps = {
  id: string;
  date: Date;
  projectId: string;
  metrics: CreateMetricValueProps[];
};

export class Snapshot extends AggregateRoot<SnapshotProps> {
  static create(props: CreateSnapshotProps) {
    return new Snapshot({
      id: props.id,
      date: new DateVO(props.date),
      projectId: props.projectId,
      metrics: props.metrics.map(MetricValue.create),
    });
  }

  validate(): void {
    this.props.date.validate();
  }
}
