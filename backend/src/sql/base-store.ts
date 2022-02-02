import { Entity } from '~/ddd/entity';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import { Database, DatabaseDefinition, TableName } from './database';
import { EntityMapper } from './entity-mapper';

export abstract class BaseStore<DomainEntity extends Entity<{ id: string }>, PersistenceRecord> {
  constructor(
    protected readonly db: Database,
    protected readonly name: keyof DatabaseDefinition,
    protected readonly mapper: EntityMapper<DomainEntity, PersistenceRecord>,
  ) {}

  abstract findOne(id: string): Promise<PersistenceRecord[]>;

  async findById(id: string): Promise<DomainEntity | undefined> {
    const records = await this.findOne(id);

    if (!records.length) {
      return;
    }

    return this.mapper.toDomain(records);
  }

  async findByIdOrFail(id: string): Promise<DomainEntity> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new EntityNotFoundError(this.name, { id });
    }

    return entity;
  }

  async save(entities: DomainEntity | DomainEntity[]): Promise<void> {
    if (!Array.isArray(entities)) {
      return this.save([entities]);
    }

    const props = this.mapper.toRecords(entities);

    for (const entry of Object.entries(props)) {
      const [tableName, records] = entry as [
        TableName,
        Array<DatabaseDefinition[keyof DatabaseDefinition]>,
      ];

      const existing = await this.db
        .selectFrom(tableName)
        .select('id')
        .where(
          'id',
          'in',
          records.map((record) => record.id),
        )
        .execute();

      const existingIds = existing.map((record) => record.id);
      const existingRecords = records.filter((record) => existingIds.includes(record.id));
      const newRecords = records.filter((record) => !existingIds.includes(record.id));

      if (existingRecords.length > 0) {
        for (const { id, ...record } of existingRecords) {
          await this.db
            .updateTable(tableName)
            .set(record as any)
            .where('id', '=', id)
            .execute();
        }
      }

      if (newRecords.length > 0) {
        await this.db.insertInto(tableName).values(newRecords).execute();
      }
    }
  }
}
