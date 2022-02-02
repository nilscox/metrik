import { EntityStore } from '~/sql/base-store';

import { Snapshot } from '../domain/snapshot';

export const SnapshotStoreToken = Symbol('SnapshotStoreToken');

export interface SnapshotStore extends EntityStore<Snapshot> {
  findAllForProjectId(projectId: string): Promise<Snapshot[]>;
}
