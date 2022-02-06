import { Test } from '@nestjs/testing';
import expect from 'expect';
import { Connection } from 'typeorm';

import { DatabaseService } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { MetricTypeEnum } from '~/modules/metric';
import { MetricOrmEntity, ProjectOrmEntity } from '~/sql/entities';

import { SnapshotStoreToken } from '../application/snapshot.store';
import { Snapshot } from '../domain/snapshot';
import { SnapshotModule } from '../snapshot.module';

import { SqlSnapshotStore } from './sql-snapshot.store';

describe('SqlSnapshotStore', () => {
  let store: SqlSnapshotStore;
  let connection: Connection;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SnapshotModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    store = moduleRef.get(SnapshotStoreToken);
    connection = moduleRef.get(Connection);

    await moduleRef.get(DatabaseService).runMigrations();
  });

  after(async () => {
    await connection?.close();
  });

  const date = new Date('2022-01-01');

  const snapshot = Snapshot.create({
    id: 's1',
    branch: 'master',
    ref: '001',
    date,
    projectId: 'p1',
    metrics: [
      {
        id: 'mv1',
        metricId: 'm1',
        value: 42,
      },
    ],
  });

  it('saves and finds a snapshot', async () => {
    await connection.manager.save(
      new ProjectOrmEntity({
        id: 'p1',
        name: 'My project',
        default_branch: 'master',
        metrics: [
          new MetricOrmEntity({
            id: 'm1',
            label: 'metric',
            projectId: 'p1',
            type: MetricTypeEnum.number,
          }),
        ],
      }),
    );

    await store.save(snapshot);
    await expect(await store.findById('s1')).toEqual(snapshot);
  });
});
