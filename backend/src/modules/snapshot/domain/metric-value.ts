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
  static create(props: CreateMetricValueProps) {
    return new MetricValue(props);
  }

  validate(): void {
    //
  }
}
