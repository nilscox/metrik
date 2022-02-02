export class InvalidMetricValueRangeError extends Error {
  constructor(public readonly metricId: string, public readonly value: number) {
    super('invalid metric value range');
  }
}
