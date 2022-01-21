import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class DevNullLogger extends ConsoleLogger {
  log(): void {
    //
  }
}
