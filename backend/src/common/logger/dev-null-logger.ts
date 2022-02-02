import { Injectable } from '@nestjs/common';

import { Logger } from '.';

@Injectable()
export class DevNullLogger extends Logger {
  override _log(): void {
    //
  }
}
