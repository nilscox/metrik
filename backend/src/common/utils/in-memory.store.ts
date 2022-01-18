import { clone } from './clone';

export class InMemoryStore<T extends { id: string }> {
  items: Map<string, T>;

  constructor(items: T[] = []) {
    this.items = new Map(items.map((item) => [item.id, item]));
  }

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
