import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { DatabaseModule } from './common/database';
import { LoggerModule } from './common/logger/logger.module';
import { AuthenticationModule } from './modules/authentication';
import { AuthorizationModule } from './modules/authorization';
import { MetricModule } from './modules/metric';
import { ProjectModule } from './modules/project';
import { SnapshotModule } from './modules/snapshot';
import { EntityNotFoundExceptionFilter } from './utils/entity-not-found.exception-filter';

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
  providers: [
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
