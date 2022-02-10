import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { Entity } from '~/ddd/entity';

import { MetricLabel } from './metric-label';
import { MetricType } from './metric-type';

export type MetricProps = {
  id: string;
  projectId: string;
  label: MetricLabel;
  type: MetricType;
};

export type CreateMetricProps = {
  id: string;
  projectId: string;
  label: string;
  type: MetricTypeEnum;
};

export class Metric extends Entity<MetricProps> {
  static create(props: CreateMetricProps) {
    return new Metric({
      id: props.id,
      projectId: props.projectId,
      label: new MetricLabel(props.label),
      type: new MetricType(props.type),
    });
  }

  validate(): void {
    this.props.label.validate();
    this.props.type.validate();
  }
}

export const createMetric = (overrides: Partial<MetricProps> = {}) => {
  return new Metric({
    id: 'metricId',
    projectId: 'projectId',
    label: new MetricLabel('label'),
    type: new MetricType(MetricTypeEnum.number),
    ...overrides,
  });
};
