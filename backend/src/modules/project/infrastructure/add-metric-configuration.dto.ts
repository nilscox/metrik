import { IsNotEmpty, IsString } from 'class-validator';

export class AddMetricConfigurationDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
