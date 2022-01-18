import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import dotenv from 'dotenv-safe';

dotenv.config();

import { AppModule } from './app.module';
import { ConfigPort } from './common/config/config.port';
import { Logger } from './common/logger/Logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigPort);
  const logger = app.get<Logger>(Logger);

  app.useLogger(logger);
  app.use(cors({ origin: true }));

  const port = Number(config.get('LISTEN_PORT'));
  const host = config.get('LISTEN_HOST');

  await app.listen(port, host);

  logger.log(`server listening on ${host}:${port}`, 'Main');
}

bootstrap();
