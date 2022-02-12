import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import dotenv from 'dotenv-safe';

import { AppModule } from './app.module';
import { ConfigPort } from './common/config';
import { Logger } from './common/logger';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigPort);
  const logger = new Logger(config);

  app.useLogger(logger);
  app.use(cors({ origin: true }));

  const port = Number(config.get('LISTEN_PORT'));
  const host = config.get('LISTEN_HOST');

  await app.listen(port, host);

  logger.info(`server listening on ${host}:${port}`, 'Main');
}

bootstrap();
