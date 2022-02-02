export interface IMetricValueDto {
  metricId: string;
  value: number;
}

export interface ISnapshotDto {
  id: string;
  date: string;
  metrics: IMetricValueDto[];
}
