import { AggregateRoot } from '~/ddd/aggregate-root';
import { Metric } from '~/modules/metric/domain/metric';

import { BranchName } from './branch-name';
import { MetricNotFoundError } from './errors/metric-not-found.error';
import { ProjectName } from './project-name';

export type ProjectProps = {
  id: string;
  name: ProjectName;
  defaultBranch: BranchName;
};

export type CreateProjectProps = {
  id: string;
  name: string;
  defaultBranch?: string;
};

export class Project extends AggregateRoot<ProjectProps> {
  constructor(props: ProjectProps, public metrics: Metric[]) {
    super(props);
  }

  static create(props: CreateProjectProps, metrics: Metric[]) {
    return new Project(
      {
        id: props.id,
        name: new ProjectName(props.name),
        defaultBranch: new BranchName(props.defaultBranch ?? 'master'),
      },
      metrics,
    );
  }

  addMetric(metric: Metric) {
    this.metrics.push(metric);
  }

  getMetric(metricId: string) {
    const metric = this.metrics.find((metric) => metric.props.id === metricId);

    if (!metric) {
      throw new MetricNotFoundError(this.props.id, metricId);
    }

    return metric;
  }

  validate(): void {
    this.props.name.validate();
    this.props.defaultBranch.validate();
  }
}
