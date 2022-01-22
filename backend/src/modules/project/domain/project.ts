import { Entity } from '~/ddd/entity';
import { ValueObject } from '~/ddd/value-object';

import { DuplicatedMetricError } from './duplicated-metric.error';
import { InvalidMetricValueTypeError } from './invalid-metric-value-type.error';
import { MetricConfigurationLabelAlreadyExistsError } from './metric-configuration-label-already-exists.error';
import { UnknownMetricLabelError } from './unknown-metric-label.error';

export type MetricConfigurationProps = {
  label: string;
  unit: string;
  type: string;
};

export class MetricConfiguration extends ValueObject<MetricConfigurationProps> {
  hasLabel(label: string): boolean {
    return this.props.label === label;
  }

  validateType(value: number): void {
    if (this.props.type === 'integer' && !Number.isInteger(value)) {
      throw new InvalidMetricValueTypeError(value, this.props.type);
    }
  }
}

export type Metric = {
  label: string;
  value: number;
};

type MetricsSnapshotProps = {
  date: Date;
  metrics: Array<Metric>;
};

export class MetricsSnapshot extends ValueObject<MetricsSnapshotProps> {}

export type ProjectProps = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: MetricConfiguration[];
  snapshots: MetricsSnapshot[];
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

  private findMetricConfig(label: string): MetricConfiguration | undefined {
    return this.props.metricsConfig.find((config) => config.hasLabel(label));
  }

  createMetricsSnapshot(date: Date, metrics: Array<Metric>) {
    for (const { label, value } of metrics) {
      if (metrics.filter((metric) => metric.label === label).length !== 1) {
        throw new DuplicatedMetricError(label);
      }

      const config = this.findMetricConfig(label);

      if (!config) {
        throw new UnknownMetricLabelError(label);
      }

      config.validateType(value);
    }

    this.props.snapshots.push(new MetricsSnapshot({ date, metrics }));
  }
}

export const createMetricsConfiguration = (
  overrides: Partial<MetricConfigurationProps> = {},
): MetricConfiguration => {
  return new MetricConfiguration({
    label: 'label',
    type: 'number',
    unit: 'number',
    ...overrides,
  });
};

export const createProject = (overrides: Partial<ProjectProps> = {}): Project => {
  return new Project({
    id: '1',
    name: 'name',
    defaultBranch: 'defaultBranch',
    metricsConfig: [],
    snapshots: [],
    ...overrides,
  });
};
