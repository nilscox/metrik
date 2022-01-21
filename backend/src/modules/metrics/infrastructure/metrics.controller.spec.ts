import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { MetricsController } from './metrics.controller';
import { MetricsModule } from './metrics.module';
import { InMemoryMetricsStore } from './store/in-memory-metrics.store';
import { MetricsStoreToken } from './store/metrics-store-token';

describe('MetricsController', () => {
  let controller: MetricsController;
  let store: InMemoryMetricsStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
    })
      .overrideProvider(MetricsStoreToken)
      .useClass(InMemoryMetricsStore)
      .compile();

    controller = module.get(MetricsController);
    store = module.get(MetricsStoreToken);
  });

  it('creates a new snapshot of metrics', async () => {
    await controller.createSnapshot({
      metrics: { 'linter-errors': 4 },
    });

    expect(store.snapshots).toHaveLength(1);
  });

  it('fetches all the metrics snapshots', async () => {
    const date = new Date('2022-12-09');

    store.snapshots = [
      {
        id: '1',
        date: '2022-12-09',
        metrics: [{ key: 'linter errors', value: 4 }],
      },
    ];

    expect(await controller.getAllMetrics()).toEqual([
      {
        id: '1',
        date,
        metrics: [{ key: 'linter errors', value: 4 }],
      },
    ]);
  });

  it('fetches the last metrics snapshot', async () => {
    const date = new Date('2022-12-09');

    store.snapshots = [
      {
        id: '1',
        date: '2022-12-09',
        metrics: [{ key: 'linter errors', value: 4 }],
      },
    ];

    expect(await controller.getLastMetrics()).toEqual({
      id: '1',
      date,
      metrics: [{ key: 'linter errors', value: 4 }],
    });
  });
});
