import { Entity } from '~/ddd/entity';
import { ValueObject } from '~/ddd/value-object';

import { MetricConfigurationLabelAlreadyExistsError } from './metric-configuration-label-already-exists.error';

type MetricConfigurationProps = {
  label: string;
  unit: string;
  type: string;
};

export class MetricConfiguration extends ValueObject<MetricConfigurationProps> {
  hasLabel(label: string): boolean {
    return this.props.label === label;
  }
}

export type ProjectProps = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: MetricConfiguration[];
};

export class Project extends Entity {
  constructor(private props: ProjectProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  getProps() {
    return this.props;
  }

  getMetricsConfig() {
    return this.props.metricsConfig;
  }

  addMetricConfig(label: string, unit: string, type: string) {
    for (const metric of this.props.metricsConfig) {
      if (metric.hasLabel(label)) {
        throw new MetricConfigurationLabelAlreadyExistsError(label);
      }
    }

    const metricConfig = new MetricConfiguration({
      label,
      unit,
      type,
    });

    this.props.metricsConfig.push(metricConfig);
  }
}

export const createProject = (overrides: Partial<ProjectProps> = {}): Project => {
  return new Project({
    id: '1',
    name: 'name',
    defaultBranch: 'defaultBranch',
    metricsConfig: [],
    ...overrides,
  });
};
