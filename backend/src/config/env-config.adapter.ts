import { Injectable } from '@nestjs/common';

import { Config, ConfigVariable } from './config.interface';

@Injectable()
export class EnvConfigAdapter implements Config {
  get(key: ConfigVariable): string {
    return process.env[key];
  }
}
