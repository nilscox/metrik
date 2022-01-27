import { AggregateRoot } from '~/ddd/AggregateRoot';
import { Entity } from '~/ddd/entity';
import { ValueObject } from '~/ddd/value-object';

import { DuplicatedMetricError } from './errors/duplicated-metric.error';
import { InvalidMetricValueTypeError } from './errors/invalid-metric-value-type.error';
import { MetricConfigurationLabelAlreadyExistsError } from './errors/metric-configuration-label-already-exists.error';
import { UnknownMetricLabelError } from './errors/unknown-metric-label.error';

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
  id: string;
  date: Date;
  reference?: string;
  metrics: Array<Metric>;
};

export class MetricsSnapshot extends Entity {
  constructor(private props: MetricsSnapshotProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  getProps() {
    return this.props;
  }
}

export type ProjectProps = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: MetricConfiguration[];
  snapshots: MetricsSnapshot[];
};

export class Project extends AggregateRoot {
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

  createMetricsSnapshot(
    id: string,
    reference: string | undefined,
    date: Date,
    metrics: Array<Metric>,
  ) {
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

    this.props.snapshots.push(new MetricsSnapshot({ id, reference, date, metrics }));
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

export const createMetricsSnapshot = (
  overrides: Partial<MetricsSnapshotProps> = {},
): MetricsSnapshot => {
  return new MetricsSnapshot({
    id: '1',
    date: new Date(),
    metrics: [],
    ...overrides,
  });
};

export const createMetric = (overrides: Partial<Metric> = {}): Metric => {
  return {
    label: 'label',
    value: 1,
    ...overrides,
  };
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
