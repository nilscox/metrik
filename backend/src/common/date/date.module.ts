import { Module } from '@nestjs/common';

import { dateProvider } from './date.provider';

@Module({
  providers: [dateProvider],
  exports: [dateProvider],
})
export class DateModule {}
