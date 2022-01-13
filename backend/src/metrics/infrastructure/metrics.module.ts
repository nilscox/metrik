import { FactoryProvider, Module } from '@nestjs/common';

import { Config } from '../../config/config.interface';
import { ConfigModule } from '../../config/config.module';
import { ConfigToken } from '../../config/config.token';
import {
  FileSystem,
  FileSystemToken,
} from '../../file-system/file-system.interface';
import { FileSystemModule } from '../../file-system/file-system.module';
import { MetricsStore } from '../domain/Metrics';

import { MetricsController } from './metrics.controller';
import { FixtureMetricsStore } from './store/fixture-metrics.store';
import { FsMetricsStore } from './store/fs-metrics.store';
import { InMemoryMetricsStore } from './store/in-memory-metrics.store';
import { MetricsStoreToken } from './store/metrics-store-token';

const metricsStoreProvider: FactoryProvider<MetricsStore> = {
  provide: MetricsStoreToken,
  inject: [ConfigToken, FileSystemToken],
  useFactory: (config: Config, fs: FileSystem) => {
    const store = config.get('METRICS_STORE');

    switch (store) {
      case 'fixture':
        return new FixtureMetricsStore();

      case 'memory':
        return new InMemoryMetricsStore();

      case 'filesystem':
        return new FsMetricsStore(fs);

      default:
        throw new Error(`invalid METRICS_STORE value '${store}'`);
    }
  },
};

@Module({
  imports: [ConfigModule, FileSystemModule],
  providers: [metricsStoreProvider],
  controllers: [MetricsController],
})
export class MetricsModule {}
