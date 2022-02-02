export class MetricNotFoundError extends Error {
  constructor(public readonly projectId: string, public readonly metricId: string) {
    super(`metric with id ${metricId} does not exist in project with id ${projectId}`);
  }
}
