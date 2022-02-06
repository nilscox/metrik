import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '~/common/config';
import { LoggerModule } from '~/common/logger';
import entities from '~/sql/entities';

import { databaseServiceProvider } from './database-service.provider';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [databaseServiceProvider],
  exports: [TypeOrmModule, databaseServiceProvider],
})
export class DatabaseModule {}
