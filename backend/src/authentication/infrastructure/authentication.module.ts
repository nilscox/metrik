import { Module, ValueProvider } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { ConfigModule } from '../../common/config/config.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { AuthenticationService } from '../domain/authentication.service';
import { CryptoPort } from '../domain/crypto.port';

import { AuthenticationController } from './authentication.controller';
import { userStoreProvider } from './user-store/user-store.provider';

const cryptoProvider: ValueProvider<CryptoPort> = {
  provide: CryptoPort,
  useValue: bcrypt,
};

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [cryptoProvider, userStoreProvider, AuthenticationService],
  controllers: [AuthenticationController],
  exports: [userStoreProvider],
})
export class AuthenticationModule {}
