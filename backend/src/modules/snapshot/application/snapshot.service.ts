import { Inject, Injectable } from '@nestjs/common';

import { DatePort } from '~/common/date';
import { GeneratorPort } from '~/common/generator';
import { Branch, BranchStore, BranchStoreToken } from '~/modules/branch';

import { Snapshot } from '../domain/snapshot';

import { SnapshotStore, SnapshotStoreToken } from './snapshot.store';

export type CreateSnapshotCommand = {
  projectId: string;
  branch: string;
  ref: string;
  metrics: Array<{ metricId: string; value: number }>;
};

@Injectable()
export class SnapshotService {
  constructor(
    private readonly date: DatePort,
    private readonly generator: GeneratorPort,
    @Inject(SnapshotStoreToken) private readonly snapshotStore: SnapshotStore,
    @Inject(BranchStoreToken) private readonly branchStore: BranchStore,
  ) {}

  async findAllForProjectId(projectId: string) {
    return this.snapshotStore.findAllForProjectId(projectId);
  }

  async createSnapshot(command: CreateSnapshotCommand) {
    let branch = await this.branchStore.findByName(command.projectId, command.branch);

    if (!branch) {
      branch = Branch.create({
        id: await this.generator.generateId(),
        projectId: command.projectId,
        name: command.branch,
      });

      await this.branchStore.save(branch);
    }

    // todo: make generator not async
    const metrics = await Promise.all(
      command.metrics.map(async ({ metricId, value }) => ({
        id: await this.generator.generateId(),
        metricId,
        value,
      })),
    );

    const snapshot = Snapshot.create({
      id: await this.generator.generateId(),
      branch,
      ref: command.ref,
      date: this.date.now,
      metrics,
    });

    await this.snapshotStore.save(snapshot);

    return snapshot;
  }
}
