import { Entity } from '~/ddd/entity';
import { EntityStore } from '~/sql/base-store';

import { clone } from './clone';
import { EntityNotFoundError } from './entity-not-found.error';

type EntityProps<T> = T extends Entity<infer P> ? P : never;

export class InMemoryStore<DomainEntity extends Entity<{ id: string }>>
  implements EntityStore<DomainEntity>
{
  private items = new Map<string, EntityProps<DomainEntity>>();

  constructor(
    private entityConstructor: new (props: EntityProps<DomainEntity>) => DomainEntity,
    items: EntityProps<DomainEntity>[] = [],
  ) {
    for (const item of items) {
      this.add(item);
    }
  }

  protected findByPredicate(
    predicate: (props: EntityProps<DomainEntity>) => boolean,
  ): DomainEntity | undefined {
    const props = this.find(predicate);

    if (props) {
      return new this.entityConstructor(props);
    }
  }

  async findById(id: string): Promise<DomainEntity | undefined> {
    return this.findByPredicate((props) => props.id === id);
  }

  async findByIdOrFail(id: string): Promise<DomainEntity> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new EntityNotFoundError(this.entityConstructor.name, { id });
    }

    return entity;
  }

  async exists(id: string): Promise<boolean> {
    return (await this.findById(id)) !== undefined;
  }

  async save(entity: DomainEntity): Promise<void> {
    this.add(entity.props as EntityProps<DomainEntity>);
  }

  add(item: EntityProps<DomainEntity>) {
    this.items.set(item.id, clone(item));
  }

  get(id: string) {
    const item = this.items.get(id);

    if (item) {
      return clone(item);
    }
  }

  all() {
    return clone(Array.from(this.items.values()));
  }

  find(
    predicate: (item: EntityProps<DomainEntity>) => boolean,
  ): EntityProps<DomainEntity> | undefined {
    return this.all().find(predicate);
  }
}
