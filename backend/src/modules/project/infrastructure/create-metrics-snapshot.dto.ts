import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ICreateMetricsSnapshotDto } from '@dtos/project/ICreateMetricsSnapshotDto';

class MetricsSnapshotDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNumber()
  value!: number;
}

export class CreateMetricsSnapshotDto implements ICreateMetricsSnapshotDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reference?: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MetricsSnapshotDto)
  metrics!: MetricsSnapshotDto[];
}
