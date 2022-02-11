import { Test } from '@nestjs/testing';
import expect from 'expect';

import { ConfigPort } from '~/common/config';
import { TestConfigAdapter } from '~/common/config/test-config.adapter';
import { DatabaseService } from '~/common/database';
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
  let database: DatabaseService;
  let projectStore: SqlProjectStore;
  let store: SqlSnapshotStore;

  before(async () => {
    const app = await Test.createTestingModule({
      imports: [SnapshotModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new TestConfigAdapter({ STORE: 'sql' }))
      .compile();

    database = app.get(DatabaseService);
    store = app.get(SnapshotStoreToken);
    projectStore = app.get(ProjectStoreToken);
  });

  after(async () => {
    await database?.closeConnection();
  });

  beforeEach(async () => {
    await database.clear();
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
