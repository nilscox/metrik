export interface IMetricDto {
  label: string;
  value: number;
}

export interface IMetricsSnapshotDto {
  id: string;
  date: string;
  metrics: Array<IMetricDto>;
}

export interface IProjectDto {
  id: string;
  name: string;
  defaultBranch: string;
  snapshots: Array<IMetricsSnapshotDto>;
}
