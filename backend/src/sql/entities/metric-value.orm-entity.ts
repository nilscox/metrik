import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

import { MetricOrmEntity } from './metric.orm-entity';
import { SnapshotOrmEntity } from './snapshot.orm-entity';

@Entity({ name: 'metric_value' })
@Unique(['snapshot', 'metric'])
export class MetricValueOrmEntity {
  constructor(props: Partial<MetricValueOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => SnapshotOrmEntity)
  snapshot!: SnapshotOrmEntity;

  @ManyToOne(() => MetricOrmEntity)
  metric!: MetricOrmEntity;

  @Column()
  metricId!: string;

  @Column()
  value!: number;
}
