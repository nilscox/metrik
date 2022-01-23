import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { CryptoModule } from '~/common/crypto';
import { GeneratorModule } from '~/common/generator';
import { LoggerModule } from '~/common/logger';
import { IsAuthenticated } from '~/modules/authorization';
import { IsNotAuthenticated } from '~/modules/authorization/is-not-authenticated.guard';
import { UserModule } from '~/modules/user';

import { AuthenticationService } from '../domain/authentication.service';

import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [LoggerModule, ConfigModule, CryptoModule, GeneratorModule, UserModule],
  providers: [AuthenticationService, IsNotAuthenticated, IsAuthenticated],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
