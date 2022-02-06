import { MetricTypeEnum } from "../../enums/MetricTypeEnum";

export interface IMetricsSnapshotDto {
  id: string;
  date: string;
  metrics: Array<IMetricDto>;
}

export interface IMetricDto {
  id: string;
  label: string;
  type: MetricTypeEnum;
}

export interface IBranchDto {
  id: string;
  name: string;
}

export interface IProjectDto {
  id: string;
  name: string;
  defaultBranch: string;
  metrics: IMetricDto[];
}
