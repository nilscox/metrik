import { ClassProvider } from '@nestjs/common';

import { Config } from './config.interface';
import { ConfigToken } from './config.token';
import { EnvConfigAdapter } from './env-config.adapter';

export const configProvider: ClassProvider<Config> = {
  provide: ConfigToken,
  useClass: EnvConfigAdapter,
};
