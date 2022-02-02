export abstract class Entity<Props extends { id: string }> {
  constructor(private _props: Props) {
    this.validate();
  }

  get props() {
    return this._props;
  }

  protected set props(props: Props) {
    this._props = props;
  }

  equals(other: this) {
    return other._props.id === other._props.id;
  }

  abstract validate(): void;
}
