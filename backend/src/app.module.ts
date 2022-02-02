import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { DatabaseModule } from './common/database';
import { LoggerModule } from './common/logger/logger.module';
import { AuthenticationModule } from './modules/authentication';
import { AuthorizationModule } from './modules/authorization';
import { MetricModule } from './modules/metric/metric.module';
import { ProjectModule } from './modules/project/project.module';
import { SnapshotModule } from './modules/snapshot/snapshot.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    AuthorizationModule,
    AuthenticationModule,
    ProjectModule,
    MetricModule,
    SnapshotModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
