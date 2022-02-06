import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ICreateMetricDto } from '@shared/dtos/project/ICreateMetricDto';
import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';

export class CreateMetricDto implements ICreateMetricDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsEnum(MetricTypeEnum)
  type!: MetricTypeEnum;
}
