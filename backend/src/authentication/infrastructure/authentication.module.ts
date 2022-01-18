import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/config/config.module';
import { CryptoModule } from '../../common/crypto/crypto.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { AuthenticationService } from '../domain/authentication.service';

import { AuthenticationController } from './authentication.controller';
import { userStoreProvider } from './user-store/user-store.provider';

@Module({
  imports: [LoggerModule, ConfigModule, CryptoModule],
  providers: [userStoreProvider, AuthenticationService],
  controllers: [AuthenticationController],
  exports: [userStoreProvider],
})
export class AuthenticationModule {}
