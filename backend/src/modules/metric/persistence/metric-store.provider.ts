import { FactoryProvider } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { Database } from '~/sql/database';

import { MetricStore } from './metric.store';
import { MetricStorePort } from './metric.store.port';

export const metricStoreProvider: FactoryProvider<MetricStorePort> = {
  provide: MetricStore,
  inject: [DatabaseToken],
  useFactory(db: Database) {
    return new MetricStore(db);
  },
};
