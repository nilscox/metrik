import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IsAuthenticated } from '~/modules/authorization';
import { IsNotAuthenticated } from '~/modules/authorization/is-not-authenticated.guard';
import { User } from '~/modules/user';

import { AuthenticationService } from './application/authentication.service';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { EmailAlreadyExistsError } from './domain/errors/email-already-exists.error';
import { InvalidCredentialsError } from './domain/errors/invalid-credentials.error';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @UseGuards(IsNotAuthenticated)
  async signup(@Body() dto: SignupDto): Promise<UserDto> {
    try {
      const user = await this.authenticationService.createUser(dto.email, dto.password);

      return new UserDto(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IsNotAuthenticated)
  async login(@Body() dto: LoginDto): Promise<UserDto> {
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

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsAuthenticated)
  async logout(@AuthenticatedUser() authUser: User): Promise<void> {
    await this.authenticationService.revokeAuthentication(authUser);
  }

  @Get('me')
  @UseGuards(IsAuthenticated)
  async getUser(@AuthenticatedUser() authUser: User): Promise<UserDto> {
    return new UserDto(authUser);
  }
}
