export interface EntityMapper<DomainEntity, OrmEntity> {
  toDomain(ormEntity: OrmEntity): DomainEntity;
  toOrm(domainEntity: DomainEntity): OrmEntity;
}
