import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { MetricOrmEntity } from './metric.orm-entity';
import { SnapshotOrmEntity } from './snapshot.orm-entity';

@Entity({ name: 'metric_value' })
export class MetricValueOrmEntity {
  constructor(props: Partial<MetricValueOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => SnapshotOrmEntity, (snapshot) => snapshot.metrics)
  snapshot!: SnapshotOrmEntity;

  @ManyToOne(() => MetricOrmEntity)
  metric!: MetricOrmEntity;

  @Column()
  metricId!: string;

  @Column()
  value!: number;
}
