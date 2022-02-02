import { Injectable } from '@nestjs/common';

import { ConfigPort, ConfigVariable } from './config.port';

@Injectable()
export class StubConfigAdapter implements ConfigPort {
  constructor(private readonly config: Partial<Record<ConfigVariable, string>> = {}) {}

  get(key: ConfigVariable): string {
    return this.config[key] ?? '';
  }
}
