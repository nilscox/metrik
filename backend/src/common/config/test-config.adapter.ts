import { ConfigVariable } from './config.port';

import { StubConfigAdapter } from '.';

export class TestConfigAdapter extends StubConfigAdapter {
  constructor(overrides: Partial<Record<ConfigVariable, string>> = {}) {
    super({
      NODE_ENV: 'test',
      STORE: 'memory',
      ...overrides,
    });
  }
}
