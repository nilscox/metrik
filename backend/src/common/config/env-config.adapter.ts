import { Injectable } from '@nestjs/common';

import { ConfigPort, ConfigVariable } from './config.port';

@Injectable()
export class EnvConfigAdapter implements ConfigPort {
  get(key: ConfigVariable): string {
    return process.env[key];
  }
}
