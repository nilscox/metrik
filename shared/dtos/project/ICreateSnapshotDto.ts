export interface ICreateMetricValueDto {
  metricId: string;
  value: number;
}

export interface ICreateSnapshotDto {
  metrics: ICreateMetricValueDto[];
}
