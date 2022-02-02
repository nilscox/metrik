import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Connection } from 'typeorm';

import { Logger } from '../logger';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  constructor(private readonly logger: Logger, private readonly connection: Connection) {
    logger.setContext('DatabaseService');
  }

  get isConnected() {
    return this.connection.isConnected;
  }

  async onApplicationShutdown() {
    if (this.isConnected) {
      await this.connection.close();
    }
  }

  async clear() {
    this.logger.debug('clearing the database');
    await this.connection.query('delete from user');
    await this.connection.query('delete from project');
  }

  async checkConnection(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    await this.connection.query('SELECT 1');

    return true;
  }

  async closeConnection(): Promise<void> {
    this.logger.debug('closing connection');
    await this.connection.close();
  }

  async runMigrations(): Promise<void> {
    this.logger.log('running migrations');
    await this.connection.runMigrations();
    this.logger.debug('migrations run successful');
  }
}
