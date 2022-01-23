export interface IMetricDto {
  label: string;
  value: number;
}

export interface IMetricsSnapshotDto {
  id: string;
  date: string;
  metrics: Array<IMetricDto>;
}

export interface IMetricConfigDto {
  label: string;
  type: string;
  unit: string;
}

export interface IProjectDto {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: IMetricConfigDto[];
  snapshots: Array<IMetricsSnapshotDto>;
}
