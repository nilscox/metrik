import { Entity } from '~/ddd/entity';
import { partition } from '~/utils/partition';

import { DatabaseDefinition, TableName } from './database';

export type EntityProps<T> = T extends Entity<infer P> ? P : never;
export type PartialRecordsMap = Partial<{ [key in TableName]: Array<DatabaseDefinition[key]> }>;

export abstract class EntityMapper<DomainEntity extends Entity<any>, PersistenceRecord> {
  constructor(
    private readonly entityConstructor: new (props: EntityProps<DomainEntity>) => DomainEntity,
    private readonly idKey: keyof PersistenceRecord,
  ) {}

  abstract toEntityProps(records: PersistenceRecord[]): EntityProps<DomainEntity>;
  abstract propsToRecords(props: EntityProps<DomainEntity>): PartialRecordsMap;

  toDomain(records: PersistenceRecord[]) {
    return new this.entityConstructor(this.toEntityProps(records));
  }

  toRecords(entities: DomainEntity[]) {
    const recordsSetArray = entities.map((entity) => this.propsToRecords(entity.props));
    const result: Record<string, Array<DatabaseDefinition[TableName]>> = {};

    for (const recordsSet of recordsSetArray) {
      for (const [tableName, records] of Object.entries(recordsSet)) {
        result[tableName] = [...(result[tableName] ?? []), ...records];
      }
    }

    return result as PartialRecordsMap;
  }

  manyToDomain(records: PersistenceRecord[]): DomainEntity[] {
    return Object.values(partition(this.idKey, records)).map(this.toDomain.bind(this));
  }
}
