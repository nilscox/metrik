import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/config/config.module';
import { FileSystemModule } from '../../common/file-system/file-system.module';

import { MetricsController } from './metrics.controller';
import { metricsStoreProvider } from './store/metrics-store.provider';

@Module({
  imports: [ConfigModule, FileSystemModule],
  providers: [metricsStoreProvider],
  controllers: [MetricsController],
})
export class MetricsModule {}
