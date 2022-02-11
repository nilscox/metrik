import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy';

import { ConfigPort } from '~/common/config';
import { Logger } from '~/common/logger';
import entities from '~/sql/entities';

import { DatabaseLogger } from './database.logger';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigPort, private readonly logger: Logger) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (this.config.env()) {
      case 'production':
        return this.productionOptions();

      case 'development':
        return this.developmentOptions();

      case 'test':
        return this.testOptions();
    }
  }

  private commonOptions(): TypeOrmModuleOptions {
    const logging = this.config.get('DATABASE_LOGS') === 'true';

    return {
      type: 'better-sqlite3',
      database: this.config.get('DATABASE_FILENAME'),
      migrations: ['dist/backend/src/sql/migrations/*.js'],
      entities,
      logging,
      logger: new DatabaseLogger(this.logger, logging),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  private productionOptions(): TypeOrmModuleOptions {
    return {
      ...this.commonOptions(),
    };
  }

  private developmentOptions(): TypeOrmModuleOptions {
    return this.commonOptions();
  }

  private testOptions(): TypeOrmModuleOptions {
    return this.commonOptions();
  }
}
