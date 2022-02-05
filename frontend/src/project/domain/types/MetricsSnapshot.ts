import { MetricValue } from './MetricValue';

export type MetricsSnapshot = {
  date: string;
  metrics: MetricValue[];
};

export const createMetricsSnapshot = (overrides: Partial<MetricsSnapshot> = {}): MetricsSnapshot => ({
  date: '2022-01-01T00:00:00.000Z',
  metrics: [],
  ...overrides,
});
