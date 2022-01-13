import { FactoryProvider } from '@nestjs/common';

import { Config } from '../../../common/config/config.interface';
import { ConfigToken } from '../../../common/config/config.token';
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
  inject: [ConfigToken, FileSystemToken],
  useFactory: (config: Config, fs: FileSystem) => {
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
