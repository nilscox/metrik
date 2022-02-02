import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import { EntityMapper } from './entity-mapper';

export interface EntityStore<Entity> {
  findById(id: string): Promise<Entity | undefined>;
  findByIdOrFail(id: string): Promise<Entity>;
  exists(id: string): Promise<boolean>;
  save(entity: Entity): Promise<void>;
}

export abstract class BaseStore<DomainEntity, OrmEntity> implements EntityStore<DomainEntity> {
  constructor(
    private entityName: string,
    protected readonly mapper: EntityMapper<DomainEntity, OrmEntity>,
  ) {}

  abstract findById(id: string): Promise<DomainEntity | undefined>;
  abstract save(entity: DomainEntity): Promise<void>;

  async exists(id: string) {
    return (await this.findById(id)) !== undefined;
  }

  async findByIdOrFail(id: string): Promise<DomainEntity> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new EntityNotFoundError(this.entityName, { id });
    }

    return entity;
  }

  protected toDomain(ormEntity: undefined | OrmEntity): undefined | DomainEntity;
  protected toDomain(ormEntity: OrmEntity[]): DomainEntity[];
  protected toDomain(
    ormEntity?: OrmEntity | OrmEntity[],
  ): undefined | DomainEntity | DomainEntity[] {
    if (!ormEntity) {
      return;
    }

    if (!Array.isArray(ormEntity)) {
      return this.toDomain([ormEntity])[0];
    }

    return ormEntity.map(this.mapper.toDomain);
  }

  protected toOrm(domainEntity: DomainEntity): OrmEntity;
  protected toOrm(domainEntity: DomainEntity[]): OrmEntity[];
  protected toOrm(domainEntity: DomainEntity | DomainEntity[]): OrmEntity | OrmEntity[] {
    if (!Array.isArray(domainEntity)) {
      return this.toOrm([domainEntity])[0];
    }

    return domainEntity.map(this.mapper.toOrm);
  }
}
