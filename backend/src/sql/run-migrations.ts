import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv-safe';

import { ConfigPort } from '~/common/config';
import { DatabaseModule } from '~/common/database/database.module';
import { DatabaseService } from '~/common/database/database.service';
import { Logger } from '~/common/logger';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

async function runMigrations() {
  process.env.DATABASE_LOGS = 'true';
  process.env.LOG_LEVEL = 'log';

  const app = await NestFactory.createApplicationContext(DatabaseModule, {
    abortOnError: true,
    bufferLogs: true,
  });

  const config = app.get(ConfigPort);
  const logger = new Logger(config);

  app.useLogger(logger);

  const database = app.get(DatabaseService);

  await database.runMigrations();
  await database.closeConnection();
}

runMigrations().catch(console.error);
