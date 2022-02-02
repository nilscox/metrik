import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ICreateMetricDto } from '@dtos/project/ICreateMetricDto';

import { MetricTypeEnum } from '../domain/metric-type';

export class CreateMetricDto implements ICreateMetricDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsEnum(MetricTypeEnum)
  type!: MetricTypeEnum;
}
