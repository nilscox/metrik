import { Metric } from '../domain/metric';

export interface MetricStorePort {
  save(metric: Metric): Promise<void>;
}
