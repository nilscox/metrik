export abstract class Entity {
  protected abstract readonly id: string;

  equals(other: this) {
    return other.id === this.id;
  }
}
