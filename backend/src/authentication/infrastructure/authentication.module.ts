import { Module, ValueProvider } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { ConfigModule } from '../../common/config/config.module';
import { LoggerModule } from '../../common/logger/logger.module';
import {
  AuthenticationService,
  Crypto,
} from '../domain/authentication.service';

import { AuthenticationController } from './authentication.controller';
import { userStoreProvider } from './user-store/user-store.provider';

const cryptoProvider: ValueProvider<Crypto> = {
  provide: Crypto,
  useValue: bcrypt,
};

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [cryptoProvider, userStoreProvider, AuthenticationService],
  controllers: [AuthenticationController],
  exports: [userStoreProvider],
})
export class AuthenticationModule {}
