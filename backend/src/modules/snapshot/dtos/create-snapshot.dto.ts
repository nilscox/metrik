import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ICreateMetricValueDto, ICreateSnapshotDto } from '@shared/dtos/project/ICreateSnapshotDto';

export class CreateMetricValueDto implements ICreateMetricValueDto {
  @IsString()
  @IsNotEmpty()
  metricId!: string;

  @IsNumber()
  value!: number;
}

export class CreateSnapshotDto implements ICreateSnapshotDto {
  @IsString()
  @IsNotEmpty()
  branch!: string;

  @IsString()
  @IsNotEmpty()
  ref!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateMetricValueDto)
  metrics!: CreateMetricValueDto[];
}
