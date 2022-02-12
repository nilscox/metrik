import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';

import { AppController } from './app.controller';
import { ConfigModule, ConfigPort } from './common/config';
import { DatabaseModule } from './common/database';
import { Logger } from './common/logger';
import { LoggerModule } from './common/logger/logger.module';
import { AuthenticationModule } from './modules/authentication';
import { AuthorizationModule } from './modules/authorization';
import { MetricModule } from './modules/metric';
import { ProjectModule } from './modules/project';
import { SnapshotModule } from './modules/snapshot';
import { CatchAllExceptionsFilter } from './utils/catch-all.exception-filter';
import { EntityNotFoundExceptionFilter } from './utils/entity-not-found.exception-filter';
import { NotFoundExceptionsFilter } from './utils/not-found.exception-filter';

@Module({
  imports: [
    ConfigModule,
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
      inject: [HttpAdapterHost, ConfigPort, Logger],
      useFactory: (httpAdapterHost: HttpAdapterHost, config: ConfigPort, logger: Logger) => {
        return new CatchAllExceptionsFilter(httpAdapterHost, config, logger);
      },
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
