import { ClassProvider } from '@nestjs/common';

import { DateAdapter } from './date.adapter';
import { DatePort } from './date.port';

export const dateProvider: ClassProvider<DatePort> = {
  provide: DatePort,
  useClass: DateAdapter,
};
