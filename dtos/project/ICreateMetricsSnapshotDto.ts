interface IMetricsSnapshotDto {
  label: string;
  value: number;
}

export interface ICreateMetricsSnapshotDto {
  metrics: IMetricsSnapshotDto[];
}
