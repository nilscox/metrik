import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { CryptoModule } from '~/common/crypto';
import { GeneratorModule } from '~/common/generator';
import { LoggerModule } from '~/common/logger';
import { UserModule } from '~/user';

import { AuthenticationService } from '../domain/authentication.service';

import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [LoggerModule, ConfigModule, CryptoModule, GeneratorModule, UserModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
