import { Snapshot } from '../domain/snapshot';

export interface SnapshotStorePort {
  findAllForProjectId(projectId: string): Promise<Snapshot[]>;
  save(snapshot: Snapshot): Promise<void>;
}
