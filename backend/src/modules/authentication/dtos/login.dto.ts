import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ILoginDto } from '@shared/dtos/authentication/ILoginDto';

export class LoginDto implements ILoginDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
