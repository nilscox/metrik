import { clone } from './clone';

export class InMemoryStore<T extends { id: string }> {
  private items = new Map<string, T>();

  add(item: T) {
    this.items.set(item.id, clone(item));
  }

  get(key: string) {
    return clone(this.items.get(key));
  }

  all() {
    return clone(Array.from(this.items.values()));
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.all().find(predicate);
  }
}
