import { ValueObject } from '~/ddd/value-object';

import { MetricLabelEmptyError } from './errors/metric-name-empty.error';

export class MetricLabel extends ValueObject<string> {
  validate(): void {
    if (this.value.length === 0) {
      throw new MetricLabelEmptyError();
    }
  }
}
