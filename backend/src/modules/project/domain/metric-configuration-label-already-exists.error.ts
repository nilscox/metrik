export class MetricConfigurationLabelAlreadyExistsError extends Error {
  constructor(public readonly label: string) {
    super(`a metric configuration with label "${label}" already exists`);
  }
}
