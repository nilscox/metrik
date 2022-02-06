import { Expose } from 'class-transformer';

import { IMetricDto } from '@shared/dtos/project/IProjectDto';
import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';

import { Metric } from '../domain/metric';

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
