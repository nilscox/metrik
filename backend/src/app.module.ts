import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/infrastructure/authentication.module';
import { UserMiddleware } from './authentication/infrastructure/user.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { MetricsModule } from './metrics/infrastructure/metrics.module';

@Module({
  imports: [LoggerModule, AuthenticationModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
