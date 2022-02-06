import { InMemoryStore } from '~/utils/in-memory.store';

import { SnapshotStore } from '../application/snapshot.store';
import { Snapshot, SnapshotProps } from '../domain/snapshot';

export class InMemorySnapshotStore extends InMemoryStore<Snapshot> implements SnapshotStore {
  constructor(items?: SnapshotProps[]) {
    super(Snapshot, items);
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    return this.filter(({ props }) => props.branch.props.projectId === projectId);
  }
}
