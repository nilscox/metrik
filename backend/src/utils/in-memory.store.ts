import { clone } from './clone';

export class InMemoryStore<T extends { id: string }> {
  items: Map<string, T>;

  constructor(items: T[] = []) {
    this.items = new Map(items.map((item) => [item.id, item]));
  }

  add(item: T) {
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

  find(predicate: (item: T) => boolean): T | undefined {
    return this.all().find(predicate);
  }
}
