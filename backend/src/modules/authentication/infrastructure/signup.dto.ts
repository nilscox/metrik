import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ISignupDto } from '@dtos/authentication/ISignupDto';

export class SignupDto implements ISignupDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
