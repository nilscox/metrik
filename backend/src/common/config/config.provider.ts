import { ClassProvider } from '@nestjs/common';

import { ConfigPort } from './config.port';
import { EnvConfigAdapter } from './env-config.adapter';

export const configProvider: ClassProvider<ConfigPort> = {
  provide: ConfigPort,
  useClass: EnvConfigAdapter,
};
