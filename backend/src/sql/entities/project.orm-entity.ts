import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { MetricOrmEntity } from './metric.orm-entity';

@Entity({ name: 'project' })
export class ProjectOrmEntity {
  constructor(props: ProjectOrmEntity) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  default_branch!: string;

  @OneToMany(() => MetricOrmEntity, (metric) => metric.project, { eager: true, cascade: true })
  metrics!: MetricOrmEntity[];
}
