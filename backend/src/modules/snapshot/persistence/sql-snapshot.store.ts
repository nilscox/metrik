import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateVO } from '~/ddd/date.value-object';
import { BranchName } from '~/modules/project/domain/branch-name';
import { BaseStore } from '~/sql/base-store';
import { MetricValueOrmEntity, SnapshotOrmEntity } from '~/sql/entities';
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

  toDomain = (ormEntity: SnapshotOrmEntity): Snapshot => {
    return new Snapshot({
      id: ormEntity.id,
      branch: new BranchName(ormEntity.branch),
      ref: ormEntity.ref,
      date: new DateVO(new Date(ormEntity.date)),
      projectId: ormEntity.projectId,
      metrics: ormEntity.metrics.map(this.metricValueMapper.toDomain),
    });
  };

  toOrm = (snapshot: Snapshot): SnapshotOrmEntity => {
    return new SnapshotOrmEntity({
      id: snapshot.props.id,
      branch: snapshot.props.branch.value,
      ref: snapshot.props.ref,
      date: snapshot.props.date.toString(),
      projectId: snapshot.props.projectId,
      metrics: snapshot.props.metrics.map(this.metricValueMapper.toOrm),
    });
  };
}

@Injectable()
export class SqlSnapshotStore
  extends BaseStore<Snapshot, SnapshotOrmEntity>
  implements SnapshotStore
{
  constructor(
    @InjectRepository(SnapshotOrmEntity)
    repository: Repository<SnapshotOrmEntity>,
  ) {
    super('snapshot', repository, new SnapshotMapper());
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    return this.toDomain(await this.repository.find({ where: { projectId } }));
  }
}
