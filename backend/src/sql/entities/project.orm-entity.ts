import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BranchOrmEntity } from './branch.orm-entity';
import { MetricOrmEntity } from './metric.orm-entity';

@Entity({ name: 'project' })
export class ProjectOrmEntity {
  constructor(props: Partial<ProjectOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @OneToOne(() => BranchOrmEntity, { nullable: true, eager: true })
  @JoinColumn()
  defaultBranch!: BranchOrmEntity;

  @OneToMany(() => MetricOrmEntity, (metric) => metric.project, { eager: true, cascade: true })
  metrics!: MetricOrmEntity[];

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}
