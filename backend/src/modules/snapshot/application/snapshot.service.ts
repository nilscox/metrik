import { Inject, Injectable } from '@nestjs/common';

import { CreateSnapshotProps, Snapshot } from '../domain/snapshot';

import { SnapshotStore, SnapshotStoreToken } from './snapshot.store';

@Injectable()
export class SnapshotService {
  constructor(@Inject(SnapshotStoreToken) private readonly snapshotStore: SnapshotStore) {}

  async findAllForProjectId(projectId: string) {
    return this.snapshotStore.findAllForProjectId(projectId);
  }

  async createSnapshot(props: CreateSnapshotProps) {
    const snapshot = Snapshot.create(props);

    snapshot.validate();
    await this.snapshotStore.save(snapshot);

    return snapshot;
  }
}
