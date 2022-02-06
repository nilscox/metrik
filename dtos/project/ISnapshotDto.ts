export interface IMetricValueDto {
  metricId: string;
  value: number;
}

export interface ISnapshotDto {
  id: string;
  branch: string;
  ref: string;
  date: string;
  metrics: IMetricValueDto[];
}
