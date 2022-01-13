import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/config/config.module';
import { LoggerModule } from '../../common/logger/logger.module';

import { AuthenticationController } from './authentication.controller';
import { userStoreProvider } from './user-store/metrics-store.provider';

@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [userStoreProvider],
  controllers: [AuthenticationController],
  exports: [userStoreProvider],
})
export class AuthenticationModule {}
