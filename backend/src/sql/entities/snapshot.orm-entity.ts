import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BranchOrmEntity } from './branch.orm-entity';
import { MetricValueOrmEntity } from './metric-value.orm-entity';

@Entity({ name: 'snapshot' })
export class SnapshotOrmEntity {
  constructor(props: Partial<SnapshotOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => BranchOrmEntity, { eager: true })
  branch!: BranchOrmEntity;

  @Column()
  ref!: string;

  @Column()
  date!: string;

  @OneToMany(() => MetricValueOrmEntity, (metric) => metric.snapshot, {
    eager: true,
    cascade: true,
  })
  metrics!: MetricValueOrmEntity[];

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}
