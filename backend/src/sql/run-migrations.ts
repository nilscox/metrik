import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv-safe';

dotenv.config();

import { DatabaseModule } from '~/common/database/database.module';
import { DatabaseService } from '~/common/database/database.service';

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(DatabaseModule);
  const database = app.get(DatabaseService);

  await database.runMigrations();
  await database.closeConnection();
}

runMigrations();
