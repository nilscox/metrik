import { Metric } from './Metric';

export type MetricsSnapshot = {
  date: string;
  metrics: Metric[];
};

export const createMetricsSnapshot = (overrides: Partial<MetricsSnapshot> = {}): MetricsSnapshot => ({
  date: '2022-01-01T00:00:00.000Z',
  metrics: [],
  ...overrides,
});
