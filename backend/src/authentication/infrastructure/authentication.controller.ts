import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { User } from '~/user/domain/user';

import { AuthenticationService } from '../domain/authentication.service';
import { InvalidCredentialsError } from '../domain/authentication-errors';

import { AuthenticatedUser } from './authenticated-user';
import { LoginDto } from './login.dto';
import { UserDto } from './user.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @AuthenticatedUser() authUser?: User): Promise<UserDto> {
    if (authUser) {
      throw new UnauthorizedException('you are already authenticated');
    }

    try {
      const user = await this.authenticationService.authenticate(dto.email, dto.password);

      return new UserDto(user);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
