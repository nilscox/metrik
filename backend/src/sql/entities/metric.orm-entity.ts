import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

// don't import from ~/modules/metric to avoid a circular dependency
import { MetricTypeEnum } from '~/modules/metric/domain/metric-type';

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
