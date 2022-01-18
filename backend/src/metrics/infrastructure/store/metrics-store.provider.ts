import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '../../../common/config/config.port';
import {
  FileSystem,
  FileSystemToken,
} from '../../../common/file-system/file-system.interface';
import { MetricsStore } from '../../domain/Metrics';

import { FixtureMetricsStore } from './fixture-metrics.store';
import { FsMetricsStore } from './fs-metrics.store';
import { InMemoryMetricsStore } from './in-memory-metrics.store';
import { MetricsStoreToken } from './metrics-store-token';

export const metricsStoreProvider: FactoryProvider<MetricsStore> = {
  provide: MetricsStoreToken,
  inject: [ConfigPort, FileSystemToken],
  useFactory: (config: ConfigPort, fs: FileSystem) => {
    const store = config.get('STORE');

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