import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';

import { ProjectOrmEntity } from './project.orm-entity';

@Entity({ name: 'metric' })
export class MetricOrmEntity {
  constructor(props: Partial<MetricOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  label!: string;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.metrics)
  project!: ProjectOrmEntity;

  @Column()
  projectId!: string;

  @Column({ type: 'text' })
  type!: MetricTypeEnum;
}
