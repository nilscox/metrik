export class MetricLabelEmptyError extends Error {
  constructor() {
    super("a metric's name cannot be empty");
  }
}
