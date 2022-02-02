import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { MetricOrmEntity } from '~/modules/project/persistence/metric.orm-entity';
import { ProjectOrmEntity } from '~/modules/project/persistence/project.orm-entity';
import { MetricValueOrmEntity } from '~/modules/snapshot/persistence/metric-value.orm-entity';
import { SnapshotOrmEntity } from '~/modules/snapshot/persistence/snapshot.orm-entity';
import { UserOrmEntity } from '~/modules/user/user-store/user.orm-entity';

import { ConfigModule, ConfigPort } from '../config';
import { Logger, LoggerModule } from '../logger';

import { DatabaseLogger } from './database.logger';
import { DatabaseService } from './database.service';

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  static readonly entities = [
    MetricOrmEntity,
    MetricValueOrmEntity,
    ProjectOrmEntity,
    SnapshotOrmEntity,
    UserOrmEntity,
  ];

  constructor(private readonly config: ConfigPort, private readonly logger: Logger) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const logging = this.config.get('DATABASE_LOGS') === 'true';

    return {
      type: 'better-sqlite3',
      database: this.config.get('DATABASE_FILENAME'),
      migrations: ['dist/backend/src/sql/migrations/*.js'],
      entities: TypeOrmConfigService.entities,
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
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
