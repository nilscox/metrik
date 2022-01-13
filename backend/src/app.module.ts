import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { MetricsModule } from './metrics/infrastructure/metrics.module';

@Module({
  imports: [LoggerModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
