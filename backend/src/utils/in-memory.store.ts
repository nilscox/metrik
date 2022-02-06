import { Entity } from '~/ddd/entity';
import { EntityStore } from '~/sql/base-store';

import { clone } from './clone';
import { EntityNotFoundError } from './entity-not-found.error';

type EntityProps<T> = T extends Entity<infer P> ? P : never;

export class InMemoryStore<DomainEntity extends Entity<{ id: string }>>
  implements EntityStore<DomainEntity>
{
  private items = new Map<string, DomainEntity>();

  constructor(
    private entityConstructor: new (props: EntityProps<DomainEntity>) => DomainEntity,
    items: EntityProps<DomainEntity>[] = [],
  ) {
    for (const item of items) {
      this.add(new this.entityConstructor(item));
    }
  }

  async findById(id: string): Promise<DomainEntity | undefined> {
    return this.find((entity) => entity.props.id === id);
  }

  async findByIdOrFail(id: string): Promise<DomainEntity> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new EntityNotFoundError(this.entityConstructor.name, { id });
    }

    return entity;
  }

  async exists(id: string): Promise<boolean> {
    return this.has(id);
  }

  async save(entity: DomainEntity): Promise<void> {
    entity.validate();
    this.add(entity);
  }

  add(item: DomainEntity) {
    this.items.set(item.props.id, clone(item));
  }

  get(id: string) {
    const item = this.items.get(id);

    if (item) {
      return clone(item);
    }
  }

  has(id: string) {
    return this.items.has(id);
  }

  all() {
    return clone(Array.from(this.items.values()));
  }

  find(predicate: (item: DomainEntity) => boolean): DomainEntity | undefined {
    return this.all().find(predicate);
  }

  filter(predicate: (item: DomainEntity) => boolean): DomainEntity[] {
    return this.all().filter(predicate);
  }
}
