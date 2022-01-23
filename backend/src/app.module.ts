import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { DatabaseModule } from './common/database';
import { LoggerModule } from './common/logger/logger.module';
import { AuthenticationModule } from './modules/authentication';
import { AuthorizationModule } from './modules/authorization';
import { ProjectModule } from './modules/project';

@Module({
  imports: [LoggerModule, DatabaseModule, AuthorizationModule, AuthenticationModule, ProjectModule],
  controllers: [AppController],
})
export class AppModule {}
