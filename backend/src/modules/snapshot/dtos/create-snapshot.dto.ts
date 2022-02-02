import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { ICreateMetricValueDto, ICreateSnapshotDto } from '@dtos/project/ICreateSnapshotDto';

export class CreateMetricValueDto implements ICreateMetricValueDto {
  @IsString()
  @IsNotEmpty()
  metricId!: string;

  @IsNumber()
  value!: number;
}

export class CreateSnapshotDto implements ICreateSnapshotDto {
  @ValidateNested()
  @Type(() => CreateMetricValueDto)
  metrics!: CreateMetricValueDto[];
}
