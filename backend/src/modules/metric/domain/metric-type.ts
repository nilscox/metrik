import { ValueObject } from '~/ddd/value-object';

import { InvalidMetricTypeError } from './errors/invalid-metric-type.error';

export enum MetricTypeEnum {
  number = 'number',
  percentage = 'percentage',
  duration = 'duration',
}

export class MetricType extends ValueObject<MetricTypeEnum> {
  validate(): void {
    if (!Object.values(MetricTypeEnum).includes(this.value)) {
      throw new InvalidMetricTypeError(this.value);
    }
  }
}
