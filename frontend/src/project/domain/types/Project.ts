import { MetricsConfig } from './MetricsConfig';
import { MetricsSnapshot } from './MetricsSnapshot';

export type Project = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: MetricsConfig[];
  snapshots: MetricsSnapshot[];
};

export const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'id',
  name: 'name',
  defaultBranch: 'defaultBranch',
  metricsConfig: [],
  snapshots: [],
  ...overrides,
});
