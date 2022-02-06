import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { MetricValueOrmEntity } from './metric-value.orm-entity';

@Entity({ name: 'snapshot' })
export class SnapshotOrmEntity {
  constructor(props: Partial<SnapshotOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  branch!: string;

  @Column()
  ref!: string;

  @Column()
  date!: string;

  @Column()
  projectId!: string;

  @OneToMany(() => MetricValueOrmEntity, (metric) => metric.snapshot, {
    eager: true,
    cascade: true,
  })
  metrics!: MetricValueOrmEntity[];
}
