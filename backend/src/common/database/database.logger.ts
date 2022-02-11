import { Logger as TypeOrmLogger } from 'typeorm';

import { Logger } from '../logger';

export class DatabaseLogger implements TypeOrmLogger {
  constructor(private readonly logger: Logger, log = true) {
    this.logger.setContext('Database');

    if (!log) {
      this.logger.setLogLevels([]);
    }
  }

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.log(this.formatQuery(query, parameters));
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    this.logger.error(`${error}\n${this.formatQuery(query, parameters)}`);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(`slow query: ${time}\n${this.formatQuery(query, parameters)}`);
  }

  logMigration(message: string) {
    this.logger.log(`migration: ${message}`);
  }

  logSchemaBuild(message: string) {
    this.logger.log(`schema build: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return this.logger.log(message);
    }

    if (level === 'info') {
      return this.logger.debug(message);
    }

    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private formatQuery(query: string, parameters?: unknown[]) {
    return query + this.formatParameters(parameters);
  }

  private formatParameters(parameters?: unknown[]) {
    if (!parameters?.length) {
      return '';
    }

    return ' -- parameters: ' + JSON.stringify(parameters);
  }
}
