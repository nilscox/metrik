import { Injectable } from '@nestjs/common';

import { MetricsSnapshots, MetricsStore } from '../../domain/Metrics';

import { BaseMetricsStore, MetricsSnapshotsData } from './base-metrics.store';
import defaultSnapshots from './fixtures/snapshots.json';

@Injectable()
export class FixtureMetricsStore
  extends BaseMetricsStore
  implements MetricsStore
{
  constructor(
    private readonly snapshots: MetricsSnapshotsData = defaultSnapshots,
  ) {
    super();
  }

  async getSnapshots(): Promise<MetricsSnapshots> {
    return this.instantiateMetricsSnapshots(this.snapshots);
  }

  async saveSnapshots(): Promise<void> {
    // do nothing
  }
}
