import { Injectable } from '@nestjs/common';

import { MetricsSnapshots, MetricsStore } from '../../domain/Metrics';

import { BaseMetricsStore, MetricsSnapshotsData } from './base-metrics.store';

@Injectable()
export class InMemoryMetricsStore
  extends BaseMetricsStore
  implements MetricsStore
{
  public snapshots: MetricsSnapshotsData = [];

  async getSnapshots(): Promise<MetricsSnapshots> {
    return this.instantiateMetricsSnapshots(this.snapshots);
  }

  async saveSnapshots(snapshots: MetricsSnapshots): Promise<void> {
    this.snapshots = this.serializeMetricsSnapshots(snapshots);
  }
}
