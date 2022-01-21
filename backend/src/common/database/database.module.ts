import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { LoggerModule } from '../logger';

import { databaseProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [databaseProvider, DatabaseService],
  exports: [databaseProvider, DatabaseService],
})
export class DatabaseModule {}
