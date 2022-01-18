import { Injectable } from '@nestjs/common';

import { ConfigPort, ConfigVariable } from './config.port';

@Injectable()
export class StubConfigAdapter implements ConfigPort {
  constructor(
    private readonly config: Partial<Record<ConfigVariable, string>> = {},
  ) {}

  get(key: ConfigVariable): string {
    if (!this.config[key]) {
      throw new Error(`no config set for configuration variable "${key}"`);
    }

    return this.config[key];
  }
}
