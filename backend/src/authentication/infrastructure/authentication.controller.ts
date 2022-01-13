import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { User } from '../domain/user';
import { UserStore } from '../domain/user.store';

import { AuthenticatedUser } from './authenticated-user';
import { LoginDto } from './login.dto';
import { UserDto } from './user.dto';
import { UserStoreToken } from './user-store/user-store-token';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(@Inject(UserStoreToken) private readonly userStore: UserStore) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @AuthenticatedUser() authUser?: User,
  ): Promise<UserDto> {
    if (authUser) {
      throw new UnauthorizedException('already authenticated');
    }

    const user = await this.userStore.findUserByEmail(dto.email);

    if (!user) {
      // todo: which error to throw?
      throw new UnauthorizedException('invalid credentials');
    }

    await user.authenticate(dto.password);

    await this.userStore.saveUser(user);

    return new UserDto(user.props);
  }
}
