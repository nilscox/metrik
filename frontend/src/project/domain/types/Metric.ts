import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';

export type Metric = {
  id: string;
  label: string;
  type: MetricTypeEnum;
};
