import { ValueObject } from '~/ddd/value-object';

import { InvalidDateError } from '../modules/snapshot/domain/errors/invalid-date.error';

export class DateVO extends ValueObject<Date> {
  override equals(other: DateVO): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  validate(): void {
    if (Number.isNaN(this.value.getTime())) {
      throw new InvalidDateError();
    }
  }

  toString() {
    return this.value.toISOString();
  }
}
