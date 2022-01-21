import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '~/common/config';
import { FileSystemPort } from '~/common/file-system';

import { MetricsStore } from '../../domain/Metrics';

import { FixtureMetricsStore } from './fixture-metrics.store';
import { FsMetricsStore } from './fs-metrics.store';
import { InMemoryMetricsStore } from './in-memory-metrics.store';
import { MetricsStoreToken } from './metrics-store-token';

export const metricsStoreProvider: FactoryProvider<MetricsStore> = {
  provide: MetricsStoreToken,
  inject: [ConfigPort, FileSystemPort],
  useFactory: (config: ConfigPort, fs: FileSystemPort) => {
    const store = config.get('STORE');

    switch (store) {
      case 'fixture':
        return new FixtureMetricsStore();

      case 'memory':
      case 'sql':
        return new InMemoryMetricsStore();

      case 'filesystem':
        return new FsMetricsStore(fs);

      default:
        throw new Error(`invalid METRICS_STORE value '${store}'`);
    }
  },
};
