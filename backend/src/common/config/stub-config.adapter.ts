import { ConfigPort, ConfigVariable } from './config.port';

export class StubConfigAdapter implements ConfigPort {
  private static defaultConfig: Record<ConfigVariable, string> = {
    LISTEN_HOST: '',
    LISTEN_PORT: '',
    DATABASE_FILENAME: ':memory:',
    STORE: 'memory',
    DATABASE_LOGS: 'false',
  };

  constructor(private readonly config: Partial<Record<ConfigVariable, string>> = {}) {}

  get(key: ConfigVariable): string {
    return this.config[key] ?? StubConfigAdapter.defaultConfig[key];
  }
}
