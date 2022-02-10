import { Metric } from './Metric';
import { MetricsSnapshot } from './MetricsSnapshot';

export type Project = {
  id: string;
  name: string;
  defaultBranch: string;
  metrics: Metric[];
  loadingSnapshots: boolean;
  snapshots: MetricsSnapshot[];
  metricCreationFormOpen: boolean;
  creatingMetric: boolean;
};

export const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'id',
  name: 'name',
  defaultBranch: 'defaultBranch',
  metrics: [],
  loadingSnapshots: false,
  snapshots: [],
  metricCreationFormOpen: false,
  creatingMetric: false,
  ...overrides,
});
