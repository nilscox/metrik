export class DuplicatedMetricError extends Error {
  constructor(public readonly label: string) {
    super(`duplicated metric with label "${label}"`);
  }
}
