import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '../config';

import { Logger } from './logger';
import { RequestLoggerMiddleware } from './request-logger.middleware';

@Module({
  imports: [ConfigModule],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
