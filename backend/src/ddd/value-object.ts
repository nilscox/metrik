export abstract class ValueObject<Value> {
  constructor(private _value: Value) {}

  get value() {
    return this._value;
  }

  protected set value(value: Value) {
    this._value = value;
  }

  equals<T extends this>(other: T) {
    return this.is(other.value);
  }

  is(value: Value) {
    return JSON.stringify(this._value) === JSON.stringify(value);
  }

  abstract validate(): void;
}
