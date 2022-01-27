export class InvalidMetricValueTypeError extends Error {
  constructor(public readonly value: number, public readonly expectedType: string) {
    super(`invalid metric value "${value}", expected type "${expectedType}"`);
  }
}
