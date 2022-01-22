export abstract class ValueObject<Props extends Record<string, unknown>> {
  constructor(protected props: Props) {}

  equals<T extends this>(other: T) {
    return Object.entries(this.props).every(([key, value]) => other.props[key] === value);
  }

  getProps() {
    return this.props;
  }
}
