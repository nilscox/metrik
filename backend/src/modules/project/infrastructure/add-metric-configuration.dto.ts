import { IsNotEmpty, IsString } from 'class-validator';

import { IAddMetricConfigurationDto } from '@dtos/project/IAddMetricConfigurationDto';

export class AddMetricConfigurationDto implements IAddMetricConfigurationDto {
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
