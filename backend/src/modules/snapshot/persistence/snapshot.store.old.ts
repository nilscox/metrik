import { Inject, Injectable } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { DateVO } from '~/ddd/date.value-object';
import { Database, MetricValueTable, SnapshotTable } from '~/sql/database';
import { partition } from '~/utils/partition';

import { MetricValue } from '../domain/metric-value';
import { Snapshot } from '../domain/snapshot';

import { SnapshotStorePort } from './snapshot.store.port';

type SnapshotRecord = {
  snapshot_id: string;
  snapshot_date: string;
  snapshot_project_id: string;
  mv_id: string;
  mv_metric_id: string;
  mv_value: number;
};

class SnapshotEntityMapper {
  private metricValuesToDomain(records: SnapshotRecord[]): MetricValue[] {
    return records.map((record) => {
      return new MetricValue({
        id: record.mv_id,
        metricId: record.mv_metric_id,
        value: record.mv_value,
      });
    });
  }

  toDomain(records: SnapshotRecord[]): Snapshot[] {
    const snapshotsRecords = partition('snapshot_id', records);

    return Object.values(snapshotsRecords).map((records) => {
      const record = records[0];

      return new Snapshot({
        id: record.snapshot_id,
        date: new DateVO(new Date(record.snapshot_date)),
        metrics: this.metricValuesToDomain(records),
        projectId: record.snapshot_project_id,
      });
    });
  }
}

@Injectable()
export class SnapshotStore implements SnapshotStorePort {
  private readonly mapper: SnapshotEntityMapper;

  constructor(@Inject(DatabaseToken) private readonly db: Database) {
    this.mapper = new SnapshotEntityMapper();
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    const records = await this.db
      .selectFrom('snapshot')
      .innerJoin('metric_value', 'metric_value.snapshot_id', 'snapshot.id')
      .select([
        'snapshot.id as snapshot_id',
        'snapshot.date as snapshot_date',
        'snapshot.project_id as snapshot_project_id',
        'metric_value.id as mv_id',
        'metric_value.metric_id as mv_metric_id',
        'metric_value.value as mv_value',
      ])
      .where('project_id', '=', projectId)
      .execute();

    return this.mapper.toDomain(records);
  }

  async save(snapshot: Snapshot): Promise<void> {
    const { count } = await this.db
      .selectFrom('snapshot')
      .select(this.db.fn.count('id').as('count'))
      .where('id', '=', snapshot.props.id)
      .executeTakeFirstOrThrow();

    const props: SnapshotTable = {
      id: snapshot.props.id,
      date: snapshot.props.date.toString(),
      project_id: snapshot.props.projectId,
    };

    // prettier-ignore
    if (count === 0) {
      await this.db
        .insertInto('snapshot')
        .values(props)
        .returning('id')
        .execute();

      const transformMetricValue = (value: MetricValue): MetricValueTable => ({
        id: value.props.id,
        metric_id: value.props.metricId,
        snapshot_id: snapshot.props.id,
        value: value.props.value,
      })

      await this.db.insertInto('metric_value').values(snapshot.props.metrics.map(transformMetricValue)).execute();
    } else {
      await this.db
        .updateTable('snapshot')
        .set(props)
        .where('id', '=', snapshot.props.id)
        .execute();
    }
  }
}
