import { Entity } from '~/ddd/entity';

import { MetricLabel } from './metric-label';
import { MetricType, MetricTypeEnum } from './metric-type';

export type MetricProps = {
  id: string;
  label: MetricLabel;
  type: MetricType;
  projectId: string;
};

export type CreateMetricProps = {
  id: string;
  label: string;
  type: MetricTypeEnum;
  projectId: string;
};

export class Metric extends Entity<MetricProps> {
  static create(props: CreateMetricProps) {
    return new Metric({
      id: props.id,
      label: new MetricLabel(props.label),
      type: new MetricType(props.type),
      projectId: props.projectId,
    });
  }

  validate(): void {
    this.props.label.validate();
    this.props.type.validate();
  }
}
