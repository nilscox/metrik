import { ConfigPort, ConfigVariable } from './config.port';

export class StubConfigAdapter extends ConfigPort {
  private static defaultConfig: Record<ConfigVariable, string> = {
    NODE_ENV: 'development',
    LISTEN_HOST: '',
    LISTEN_PORT: '',
    LOG_LEVEL: 'warn',
    DATABASE_FILENAME: ':memory:',
    STORE: 'sql',
    DATABASE_LOGS: 'false',
  };

  constructor(private readonly config: Partial<Record<ConfigVariable, string>> = {}) {
    super();
  }

  get(key: ConfigVariable): string {
    return this.config[key] ?? StubConfigAdapter.defaultConfig[key];
  }
}
