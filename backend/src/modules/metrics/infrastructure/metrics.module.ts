import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { FileSystemModule } from '~/common/file-system';

import { MetricsController } from './metrics.controller';
import { metricsStoreProvider } from './store/metrics-store.provider';

@Module({
  imports: [ConfigModule, FileSystemModule],
  providers: [metricsStoreProvider],
  controllers: [MetricsController],
})
export class MetricsModule {}
