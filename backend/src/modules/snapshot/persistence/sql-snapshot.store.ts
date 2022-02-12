import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { DateVO } from '~/ddd/date.value-object';
import { BranchMapper } from '~/modules/branch';
import { BaseStore } from '~/sql/base-store';
import { MetricOrmEntity, MetricValueOrmEntity, SnapshotOrmEntity } from '~/sql/entities';
import { EntityMapper } from '~/sql/entity-mapper';

import { SnapshotStore } from '../application/snapshot.store';
import { MetricValue } from '../domain/metric-value';
import { Snapshot } from '../domain/snapshot';

class MetricValueMapper implements EntityMapper<MetricValue, MetricValueOrmEntity> {
  toDomain = (ormEntity: MetricValueOrmEntity): MetricValue => {
    return new MetricValue({
      id: ormEntity.id,
      metricId: ormEntity.metricId,
      value: ormEntity.value,
    });
  };

  toOrm = (metric: MetricValue): MetricValueOrmEntity => {
    return new MetricValueOrmEntity({
      id: metric.props.id,
      metricId: metric.props.metricId,
      value: metric.props.value,
    });
  };
}

class SnapshotMapper implements EntityMapper<Snapshot, SnapshotOrmEntity> {
  private readonly metricValueMapper = new MetricValueMapper();
  private readonly branchMapper = new BranchMapper();

  toDomain = (ormEntity: SnapshotOrmEntity): Snapshot => {
    return new Snapshot({
      id: ormEntity.id,
      branch: this.branchMapper.toDomain(ormEntity.branch),
      ref: ormEntity.ref,
      date: new DateVO(new Date(ormEntity.date)),
      metrics: ormEntity.metrics.map(this.metricValueMapper.toDomain),
    });
  };

  toOrm = (snapshot: Snapshot): SnapshotOrmEntity => {
    return new SnapshotOrmEntity({
      id: snapshot.props.id,
      branch: this.branchMapper.toOrm(snapshot.props.branch),
      ref: snapshot.props.ref,
      date: snapshot.props.date.toString(),
      metrics: snapshot.props.metrics.map(this.metricValueMapper.toOrm),
    });
  };
}

@Injectable()
export class SqlSnapshotStore
  extends BaseStore<Snapshot, SnapshotOrmEntity>
  implements SnapshotStore
{
  constructor(private connection: Connection) {
    super('snapshot', connection.getRepository(SnapshotOrmEntity), new SnapshotMapper());
  }

  private get metricRepository() {
    return this.connection.getRepository(MetricOrmEntity);
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    const snapshots = await this.repository
      .createQueryBuilder('snapshot')
      .leftJoinAndSelect('snapshot.branch', 'branch')
      .leftJoinAndSelect('snapshot.metrics', 'metric_value')
      .leftJoin('metric_value.metric', 'metric')
      .where('branch.projectId = :projectId', { projectId })
      .orderBy('snapshot.date', 'ASC')
      .getMany();

    const projectMetrics = await this.metricRepository.find({
      select: ['id'],
      where: { projectId },
      order: { createdAt: 'ASC' },
    });

    const metricsIds = projectMetrics.map(({ id }) => id);

    // https://github.com/typeorm/typeorm/issues/2620
    const compareMetricValues = (a: MetricValueOrmEntity, b: MetricValueOrmEntity) => {
      return metricsIds.indexOf(a.metricId) - metricsIds.indexOf(b.metricId);
    };

    for (const snapshot of snapshots) {
      snapshot.metrics.sort(compareMetricValues);
    }

    return this.toDomain(snapshots);
  }
}
