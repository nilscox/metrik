import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { ProjectOrmEntity } from './project.orm-entity';

@Entity({ name: 'branch' })
export class BranchOrmEntity {
  constructor(props: Partial<BranchOrmEntity>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => ProjectOrmEntity, { nullable: false })
  project!: ProjectOrmEntity;

  @Column()
  projectId!: string;
}
