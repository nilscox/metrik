import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv-safe';

import { DatabaseModule } from '~/common/database/database.module';
import { DatabaseService } from '~/common/database/database.service';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(DatabaseModule);
  const database = app.get(DatabaseService);

  await database.runMigrations();
  await database.closeConnection();
}

runMigrations();
