import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigModule, ConfigPort } from '~/common/config';
import { Logger, LoggerModule } from '~/common/logger';
import entities from '~/sql/entities';

import { DatabaseLogger } from './database.logger';
import { DatabaseService } from './database.service';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigPort, private readonly logger: Logger) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const logging = this.config.get('DATABASE_LOGS') === 'true';

    return {
      type: 'better-sqlite3',
      database: this.config.get('DATABASE_FILENAME'),
      migrations: ['dist/backend/src/sql/migrations/*.js'],
      entities,
      migrationsRun: false,
      synchronize: false,
      logging,
      logger: new DatabaseLogger(this.logger, logging),
    };
  }
}

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
