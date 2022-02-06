import { AggregateRoot } from '~/ddd/aggregate-root';
import { Branch, BranchName, createBranch, CreateBranchProps } from '~/modules/branch';
import { Metric } from '~/modules/metric';

import { MetricNotFoundError } from './errors/metric-not-found.error';
import { ProjectName } from './project-name';

export type ProjectProps = {
  id: string;
  name: ProjectName;
  defaultBranch: Branch;
  metrics: Metric[];
};

export type CreateProjectProps = {
  id: string;
  name: string;
  defaultBranch: Omit<CreateBranchProps, 'name'> & { name?: string };
};

export class Project extends AggregateRoot<ProjectProps> {
  constructor(props: ProjectProps) {
    super(props);
  }

  static create(props: CreateProjectProps) {
    return new Project({
      id: props.id,
      name: new ProjectName(props.name),
      defaultBranch: Branch.create({
        ...props.defaultBranch,
        name: props.defaultBranch?.name ?? 'master',
      }),
      metrics: [],
    });
  }

  addMetric(metric: Metric) {
    this.props.metrics.push(metric);
  }

  getMetric(metricId: string) {
    const metric = this.props.metrics.find((metric) => metric.props.id === metricId);

    if (!metric) {
      throw new MetricNotFoundError(this.props.id, metricId);
    }

    return metric;
  }

  validate(): void {
    this.props.name.validate();
    this.props.defaultBranch.validate();
    this.props.metrics.forEach((metric) => metric.validate());
  }
}

export const createProject = (overrides: Partial<ProjectProps> = {}) => {
  return new Project({
    id: 'projectId',
    name: new ProjectName('name'),
    defaultBranch: createBranch({
      projectId: 'projectId',
    }),
    metrics: [],
    ...overrides,
  });
};
