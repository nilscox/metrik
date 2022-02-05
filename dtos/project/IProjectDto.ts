export interface IMetricsSnapshotDto {
  id: string;
  date: string;
  metrics: Array<IMetricDto>;
}

export enum MetricTypeEnum {
  number = "number",
  percentage = "percentage",
  duration = "duration",
}

export interface IMetricDto {
  id: string;
  label: string;
  type: MetricTypeEnum;
}

export interface IProjectDto {
  id: string;
  name: string;
  defaultBranch: string;
  metrics: IMetricDto[];
}
