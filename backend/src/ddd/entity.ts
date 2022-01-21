export abstract class Entity {
  protected abstract readonly id: string;

  equals<T extends this>(other: T) {
    return other.id === this.id;
  }
}
