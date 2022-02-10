import { MetricTypeEnum } from "../../enums/MetricTypeEnum";

export interface ICreateMetricDto {
  label: string;
  type: MetricTypeEnum;
}
