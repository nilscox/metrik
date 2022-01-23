interface IMetricsSnapshotDto {
  label: string;
  value: number;
}

export interface ICreateMetricsSnapshotDto {
  reference?: string;
  metrics: IMetricsSnapshotDto[];
}
