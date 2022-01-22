import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { ICreateMetricsSnapshotDto } from '@dtos/project/ICreateMetricsSnapshotDto';

class MetricsSnapshotDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNumber()
  value!: number;
}

export class CreateMetricsSnapshotDto implements ICreateMetricsSnapshotDto {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MetricsSnapshotDto)
  metrics!: MetricsSnapshotDto[];
}
