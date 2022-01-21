import { Injectable } from '@nestjs/common';

import { ConfigPort, ConfigVariable } from './config.port';

@Injectable()
export class EnvConfigAdapter implements ConfigPort {
  get(key: ConfigVariable): string {
    const value = process.env[key];

    if (!value) {
      throw new Error(`missing environment variable "${key}"`);
    }

    return value;
  }
}
