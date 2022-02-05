import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '~/common/config';
import { LoggerModule } from '~/common/logger';
import entities from '~/sql/entities';

import { DatabaseService } from './database.service';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
