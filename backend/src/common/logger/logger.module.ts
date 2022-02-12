import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';

import { Logger } from './logger';

@Module({
  imports: [ConfigModule],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
