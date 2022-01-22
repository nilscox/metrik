import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class MetricsSnapshotDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsNumber()
  value!: number;
}

export class CreateMetricsSnapshotDto {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MetricsSnapshotDto)
  metrics!: MetricsSnapshotDto[];
}
