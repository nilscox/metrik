import { Expose } from 'class-transformer';

import { IMetricDto } from '@dtos/project/IProjectDto';

import { Metric } from '../domain/metric';
import { MetricTypeEnum } from '../domain/metric-type';

export class MetricDto implements IMetricDto {
  constructor(metric: Metric) {
    this.id = metric.props.id;
    this.label = metric.props.label.value;
    this.type = metric.props.type.value;
  }

  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  type: MetricTypeEnum;
}
