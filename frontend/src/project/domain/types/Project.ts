import { Metric } from './Metric';
import { MetricsSnapshot } from './MetricsSnapshot';

export type Project = {
  id: string;
  name: string;
  defaultBranch: string;
  metrics: Metric[];
  snapshots: MetricsSnapshot[];
};

export const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'id',
  name: 'name',
  defaultBranch: 'defaultBranch',
  metrics: [],
  snapshots: [],
  ...overrides,
});
