import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/infrastructure/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { LoggerModule } from './common/logger/logger.module';
import { MetricsModule } from './metrics/infrastructure/metrics.module';
import { ProjectModule } from './project/infrastructure/project.module';

@Module({
  imports: [LoggerModule, AuthorizationModule, AuthenticationModule, ProjectModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
