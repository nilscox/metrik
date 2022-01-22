import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { ICreateProjectDto } from '@dtos/project/ICreateProjectDto';

export class CreateProjectDto implements ICreateProjectDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  defaultBranch = 'master';
}
