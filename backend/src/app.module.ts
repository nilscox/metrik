import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { AuthenticationModule } from './modules/authentication';
import { AuthorizationModule } from './modules/authorization';
import { ProjectModule } from './modules/project';

@Module({
  imports: [LoggerModule, AuthorizationModule, AuthenticationModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
