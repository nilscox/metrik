import { ValueObject } from '~/ddd/value-object';

import { BranchNameEmptyError } from './errors/branch-name-empty.error';

export class BranchName extends ValueObject<string> {
  validate(): void {
    if (this.value.length === 0) {
      throw new BranchNameEmptyError();
    }
  }
}
