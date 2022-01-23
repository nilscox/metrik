import path from 'path';

import { Inject, Injectable } from '@nestjs/common';
import { FileMigrationProvider, Migrator } from 'kysely';

import { Database } from '~/sql/database';

import { Logger } from '../logger';

import { DatabaseToken } from './database.provider';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly logger: Logger,
    @Inject(DatabaseToken) private readonly db: Database,
  ) {
    logger.setContext('DatabaseService');
  }

  async clear() {
    await this.db.deleteFrom('user').execute();
    await this.db.deleteFrom('project').execute();
  }

  async checkConnection(): Promise<boolean> {
    if (!this.db) {
      return false;
    }

    await this.db.raw('SELECT 1').execute();

    return true;
  }

  async closeConnection(): Promise<void> {
    await this.db.destroy();
  }

  async runMigrations(): Promise<boolean> {
    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider(path.resolve(__dirname, '..', '..', 'sql', 'migrations')),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === 'Success') {
        this.logger.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        this.logger.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      this.logger.error('failed to migrate');
      this.logger.error(error);

      return false;
    }

    return true;
  }
}
