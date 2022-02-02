export class InvalidMetricTypeError extends Error {
  constructor(type: string) {
    super(`invalid metric type "${type}"`);
  }
}
