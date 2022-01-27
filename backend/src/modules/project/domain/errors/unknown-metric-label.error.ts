export class UnknownMetricLabelError extends Error {
  constructor(public readonly label: string) {
    super(`unknown metric label "${label}"`);
  }
}
