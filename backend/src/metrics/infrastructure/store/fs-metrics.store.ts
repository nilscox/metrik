import { Injectable } from '@nestjs/common';

import { FileNotFoundError } from '~/common/file-system/file-not-found.error';
import { FileSystemPort } from '~/common/file-system/file-system.port';

import { MetricsSnapshots, MetricsStore } from '../../domain/Metrics';

import { BaseMetricsStore, MetricsSnapshotsData } from './base-metrics.store';

@Injectable()
export class FsMetricsStore extends BaseMetricsStore implements MetricsStore {
  constructor(private readonly fs: FileSystemPort) {
    super();
  }

  async getSnapshots(): Promise<MetricsSnapshots> {
    try {
      const db = await this.fs.readJsonFile<MetricsSnapshotsData>('db.json');

      return this.instantiateMetricsSnapshots(db);
    } catch (error) {
      if (!(error instanceof FileNotFoundError)) {
        throw error;
      }
    }

    const snapshots = new MetricsSnapshots([]);

    this.saveSnapshots(snapshots);

    return snapshots;
  }

  async saveSnapshots(snapshots: MetricsSnapshots) {
    await this.fs.writeFile('db.json', snapshots);
  }
}
