import { Test } from '@nestjs/testing';
import expect from 'expect';
import { InsertObject } from 'kysely';

import { DatabaseService, DatabaseToken } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { MetricTypeEnum } from '~/modules/metric/domain/metric-type';
import {
  Database,
  DatabaseDefinition,
  MetricValueTable,
  SnapshotTable,
  TableName,
} from '~/sql/database';

import { Snapshot } from '../domain/snapshot';
import { SnapshotModule } from '../snapshot.module';

import { SnapshotStore } from './snapshot.store';

describe('SnapshotStore', () => {
  let store: SnapshotStore;
  let db: Database;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SnapshotModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    store = moduleRef.get(SnapshotStore);
    db = moduleRef.get(DatabaseToken);

    await moduleRef.get(DatabaseService).runMigrations();
  });

  const metricValueRecord1: MetricValueTable = {
    id: 'mv1',
    snapshot_id: 's1',
    metric_id: 'm1',
    value: 1,
  };

  const metricValueRecord2: MetricValueTable = {
    id: 'mv2',
    snapshot_id: 's1',
    metric_id: 'm2',
    value: 2,
  };

  const date = new Date('2022-01-01');

  const snapshot = Snapshot.create({
    id: 's1',
    date,
    metrics: [
      {
        id: 'mv1',
        metricId: 'm1',
        value: 1,
      },
      {
        id: 'mv2',
        metricId: 'm2',
        value: 2,
      },
    ],
    projectId: 'p1',
  });

  const record: SnapshotTable = {
    id: 's1',
    date: date.toISOString(),
    project_id: 'p1',
  };

  const insert = async <TN extends TableName>(
    tableName: TN,
    record: InsertObject<DatabaseDefinition, TN>,
  ) => {
    await db.insertInto(tableName).values(record).execute();
  };

  const select = async <TN extends TableName>(tableName: TN, id: string) => {
    return db
      .selectFrom(tableName)
      .selectAll()
      .where('id', '=', id as any)
      .executeTakeFirst();
  };

  beforeEach(async () => {
    await insert('project', {
      id: 'p1',
      name: 'project',
      default_branch: 'master',
    });

    await insert('metric', {
      id: 'm1',
      project_id: 'p1',
      label: 'metric 1',
      type: MetricTypeEnum.number,
    });

    await insert('metric', {
      id: 'm2',
      project_id: 'p1',
      label: 'metric 2',
      type: MetricTypeEnum.number,
    });
  });

  describe('findById', () => {
    it('finds a snapshot from its id', async () => {
      await insert('snapshot', record);
      await insert('metric_value', metricValueRecord1);
      await insert('metric_value', metricValueRecord2);

      expect(await store.findById('s1')).toEqual(snapshot);
    });
  });

  describe('save', () => {
    it('creates a new snapshot and its associated metrics', async () => {
      await store.save(snapshot);

      expect(await select('snapshot', 's1')).toEqual(record);
      expect(await select('metric_value', 'mv1')).toEqual(metricValueRecord1);
      expect(await select('metric_value', 'mv2')).toEqual(metricValueRecord2);
    });
  });
});
