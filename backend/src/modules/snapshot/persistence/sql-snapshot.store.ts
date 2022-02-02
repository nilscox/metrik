import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateVO } from '~/ddd/date.value-object';
import { BaseStore } from '~/sql/base-store';
import { EntityMapper } from '~/sql/entity-mapper';

import { SnapshotStore } from '../application/snapshot.store';
import { MetricValue } from '../domain/metric-value';
import { Snapshot } from '../domain/snapshot';

import { MetricValueOrmEntity } from './metric-value.orm-entity';
import { SnapshotOrmEntity } from './snapshot.orm-entity';

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
      date: new DateVO(new Date(ormEntity.date)),
      projectId: ormEntity.projectId,
      metrics: ormEntity.metrics.map(this.metricValueMapper.toDomain),
    });
  };

  toOrm = (snapshot: Snapshot): SnapshotOrmEntity => {
    return new SnapshotOrmEntity({
      id: snapshot.props.id,
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
    private readonly snapshotRepository: Repository<SnapshotOrmEntity>,
  ) {
    super('snapshot', new SnapshotMapper());
  }

  async findById(id: string): Promise<Snapshot | undefined> {
    return this.toDomain(await this.snapshotRepository.findOne(id));
  }

  async findAllForProjectId(projectId: string): Promise<Snapshot[]> {
    return this.toDomain(await this.snapshotRepository.find({ where: { projectId } }));
  }

  async save(snapshot: Snapshot): Promise<void> {
    await this.snapshotRepository.save(this.toOrm(snapshot));
  }
}
