import { Entity } from '~/ddd/entity';

export type MetricValueProps = {
  id: string;
  metricId: string;
  value: number;
};

export type CreateMetricValueProps = {
  id: string;
  metricId: string;
  value: number;
};

export class MetricValue extends Entity<MetricValueProps> {
  constructor(props: MetricValueProps) {
    super(props);
  }

  static create(props: CreateMetricValueProps) {
    return new MetricValue(props);
  }

  validate(): void {
    // const { metricId, value } = this.props;
    // const { metric } = this;
    //
    // if (metric.props.type.is(MetricTypeEnum.percentage)) {
    //   if (value < 0 || value > 1) {
    //     throw new InvalidMetricValueRangeError(metricId, value);
    //   }
    // }
  }
}

export const createMetricValue = (overrides: Partial<MetricValueProps> = {}) => {
  return new MetricValue({
    id: 'metricValueId',
    metricId: 'metricId',
    value: 0,
    ...overrides,
  });
};
