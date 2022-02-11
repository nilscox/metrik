import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';

import { ConfigPort } from '~/common/config';
import { TestConfigAdapter } from '~/common/config/test-config.adapter';
import { BranchName, BranchStore, BranchStoreToken, createBranch } from '~/modules/branch';
import { createMetric } from '~/modules/metric/domain/metric';
import { ProjectStore, ProjectStoreToken } from '~/modules/project';
import { createProject, Project } from '~/modules/project/domain/project';

import { SnapshotModule, SnapshotStoreToken } from '../index';

import { SnapshotService } from './snapshot.service';
import { SnapshotStore } from './snapshot.store';

describe('SnapshotService', () => {
  let projectStore: ProjectStore;
  let snapshotStore: SnapshotStore;
  let branchStore: BranchStore;
  let snapshotService: SnapshotService;

  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [SnapshotModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new TestConfigAdapter())
      .compile();

    projectStore = app.get(ProjectStoreToken);
    snapshotStore = app.get(SnapshotStoreToken);
    branchStore = app.get(BranchStoreToken);
    snapshotService = app.get(SnapshotService);
  });

  afterEach(async () => {
    await app?.close();
  });

  const execute = (project: Project, branch: string, ref: string, values: number[]) => {
    return snapshotService.createSnapshot({
      projectId: project.props.id,
      branch,
      ref,
      metrics: project.props.metrics.map((metric, n) => ({
        metricId: metric.props.id,
        value: values[n],
      })),
    });
  };

  const branch = createBranch({ name: new BranchName('master') });
  const project = createProject({ defaultBranch: branch });
  const metric = createMetric({ projectId: project.props.id });

  project.addMetric(metric);

  beforeEach(async () => {
    await projectStore.save(project);
    await branchStore.save(project.props.defaultBranch);
  });

  it('creates a snapshot', async () => {
    const snapshot = await execute(project, 'master', 'commit', [42]);

    expect(await snapshotStore.findById(snapshot.props.id)).toEqual(snapshot);
  });

  it('creates a snapshot on a new branch', async () => {
    await execute(project, 'feature', 'commit', [42]);

    expect(await branchStore.findByName(project.props.id, 'feature')).toBeTruthy();
  });
});
