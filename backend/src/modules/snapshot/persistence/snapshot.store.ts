import { Inject, Injectable } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { DateVO } from '~/ddd/date.value-object';
import { BaseStore } from '~/sql/base-store';
import { Database } from '~/sql/database';
import { EntityMapper, PartialRecordsMap } from '~/sql/entity-mapper';

import { MetricValue } from '../domain/metric-value';
import { Snapshot, SnapshotProps } from '../domain/snapshot';

import { SnapshotStorePort } from './snapshot.store.port';

type SnapshotRecord = {
  snapshot_id: string;
  snapshot_date: string;
  snapshot_project_id: string;
  mv_id: string;
  mv_metric_id: string;
  mv_value: number;
};

class SnapshotEntityMapper extends EntityMapper<Snapshot, SnapshotRecord> {
  constructor() {
    super(Snapshot, 'snapshot_id');
  }

  toEntityProps(records: SnapshotRecord[]): SnapshotProps {
    const record = records[0];

    return {
      id: record.snapshot_id,
      date: new DateVO(new Date(record.snapshot_date)),
      metrics: records.map((record) => {
        return new MetricValue({
          id: record.mv_id,
          metricId: record.mv_metric_id,
          value: record.mv_value,
        });
      }),
      projectId: record.snapshot_project_id,
    };
  }

  propsToRecords(props: SnapshotProps): PartialRecordsMap {
    return {
      snapshot: [
        {
          id: props.id,
          date: props.date.toString(),
          project_id: props.projectId,
        },
      ],
      metric_value: props.metrics.map((metric) => ({
        id: metric.props.id,
        metric_id: metric.props.metricId,
        snapshot_id: props.id,
        value: metric.props.value,
      })),
    };
  }
}

@Injectable()
export class SnapshotStore
  extends BaseStore<Snapshot, SnapshotRecord>
  implements SnapshotStorePort
{
  constructor(@Inject(DatabaseToken) db: Database) {
    super(db, 'snapshot', new SnapshotEntityMapper());
  }

  private createSelectQueryBuilder() {
    return this.db
      .selectFrom('snapshot')
      .innerJoin('metric_value', 'metric_value.snapshot_id', 'snapshot.id')
      .select([
        'snapshot.id as snapshot_id',
        'snapshot.date as snapshot_date',
        'snapshot.project_id as snapshot_project_id',
        'metric_value.id as mv_id',
        'metric_value.metric_id as mv_metric_id',
        'metric_value.value as mv_value',
      ]);
  }

  async findOne(id: string): Promise<SnapshotRecord[]> {
    return this.createSelectQueryBuilder().where('snapshot_id', '=', id).execute();
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    const records = await this.createSelectQueryBuilder()
      .where('project_id', '=', projectId)
      .execute();

    return this.mapper.manyToDomain(records);
  }
}
