import { ValueObject } from '~/ddd/value-object';

import { ProjectNameEmptyError } from './errors/project-name-empty.error';

export class ProjectName extends ValueObject<string> {
  validate(): void {
    if (this.value.length === 0) {
      throw new ProjectNameEmptyError();
    }
  }
}
