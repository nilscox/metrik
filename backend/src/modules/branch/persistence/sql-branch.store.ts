import { Connection } from 'typeorm';

import { BaseStore } from '~/sql/base-store';
import { BranchOrmEntity } from '~/sql/entities';
import { EntityMapper } from '~/sql/entity-mapper';

import { BranchStore } from '../application/branche.store';
import { Branch } from '../domain/branch';
import { BranchName } from '../domain/branch-name';

export class BranchMapper implements EntityMapper<Branch, BranchOrmEntity> {
  toDomain(ormEntity: BranchOrmEntity): Branch {
    return new Branch({
      id: ormEntity.id,
      projectId: ormEntity.projectId,
      name: new BranchName(ormEntity.name),
    });
  }

  toOrm(branch: Branch): BranchOrmEntity {
    return new BranchOrmEntity({
      id: branch.props.id,
      projectId: branch.props.projectId,
      name: branch.props.name.value,
    });
  }
}

export class SqlBranchStore extends BaseStore<Branch, BranchOrmEntity> implements BranchStore {
  constructor(connection: Connection) {
    super('branch', connection.getRepository(BranchOrmEntity), new BranchMapper());
  }

  async findByName(projectId: string, name: string): Promise<Branch | undefined> {
    return this.toDomain(await this.repository.findOne({ projectId, name }));
  }

  async findAllForProjectId(projectId: string): Promise<Branch[]> {
    return this.toDomain(await this.repository.find({ where: { projectId } }));
  }
}
