import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { ValueObject } from '~/ddd/value-object';

import { InvalidMetricTypeError } from './errors/invalid-metric-type.error';

export class MetricType extends ValueObject<MetricTypeEnum> {
  validate(): void {
    if (!Object.values(MetricTypeEnum).includes(this.value)) {
      throw new InvalidMetricTypeError(this.value);
    }
  }
}
