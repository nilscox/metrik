import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { Connection } from 'typeorm';

import { DatabaseService } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { DateVO } from '~/ddd/date.value-object';
import { createBranch } from '~/modules/branch';
import { createMetric } from '~/modules/metric/domain/metric';
import { ProjectStoreToken } from '~/modules/project';
import { createProject } from '~/modules/project/domain/project';
import { SqlProjectStore } from '~/modules/project/persistence/sql-project.store';

import { SnapshotStoreToken } from '../application/snapshot.store';
import { createMetricValue } from '../domain/metric-value';
import { createSnapshot } from '../domain/snapshot';
import { SnapshotModule } from '../snapshot.module';

import { SqlSnapshotStore } from './sql-snapshot.store';

describe('SqlSnapshotStore', () => {
  let projectStore: SqlProjectStore;
  let store: SqlSnapshotStore;
  let app: TestingModule;

  before(async () => {
    app = await Test.createTestingModule({
      imports: [SnapshotModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    projectStore = app.get(ProjectStoreToken);
    store = app.get(SnapshotStoreToken);

    await app.get(DatabaseService).runMigrations();
  });

  after(async () => {
    await app?.get(Connection).close();
  });

  beforeEach(async () => {
    await app.get(DatabaseService).clear();
  });

  const project = createProject({
    id: 'p1',
    defaultBranch: createBranch({ id: 'b1', projectId: 'p1' }),
    metrics: [createMetric({ id: 'm1' })],
  });

  const date = new Date('2022-01-01');

  const snapshot = createSnapshot({
    id: 's1',
    branch: project.props.defaultBranch,
    ref: '001',
    date: new DateVO(date),
    metrics: [
      createMetricValue({
        id: 'mv1',
        metricId: 'm1',
        value: 42,
      }),
    ],
  });

  it('saves and finds a snapshot', async () => {
    await projectStore.insert(project);

    await store.save(snapshot);
    await expect(await store.findById('s1')).toEqual(snapshot);
  });

  it('finds all snapshots for a given project id', async () => {
    await projectStore.insert(project);
    await store.save(snapshot);

    await expect(await store.findAllForProjectId('p1')).toEqual([snapshot]);

    const otherProject = createProject();
    const otherSnapshot = createSnapshot({ branch: otherProject.props.defaultBranch });

    await projectStore.insert(otherProject);

    await store.save(otherSnapshot);
    await expect(await store.findAllForProjectId('p1')).toEqual([snapshot]);
  });
});
