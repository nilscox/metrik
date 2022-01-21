import { Module } from '@nestjs/common';

import { AuthorizationModule } from '~/authorization/authorization.module';
import { ConfigModule } from '~/common/config/config.module';
import { CryptoModule } from '~/common/crypto/crypto.module';
import { GeneratorModule } from '~/common/generator/generator.module';
import { LoggerModule } from '~/common/logger/logger.module';
import { UserModule } from '~/user/infrastructure/user.module';

import { AuthenticationService } from '../domain/authentication.service';

import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    CryptoModule,
    GeneratorModule,
    UserModule,
    AuthorizationModule,
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
