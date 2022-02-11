// prettier-ignore
export const configVariables = [
  'NODE_ENV',
  'LISTEN_HOST',
  'LISTEN_PORT',
  'LOG_LEVEL',
  'STORE',
  'DATABASE_FILENAME',
  'DATABASE_LOGS',
] as const;

export type ConfigVariable = typeof configVariables[number];

const environments = ['production', 'development', 'test'] as const;
type Environment = typeof environments[number];

function isEnvironment(env: string): env is Environment {
  return environments.includes(env as Environment);
}

export abstract class ConfigPort {
  abstract get(key: ConfigVariable): string;

  env(): Environment {
    const nodeEnv = this.get('NODE_ENV');

    if (!isEnvironment(nodeEnv)) {
      throw new Error(`invalid NODE_ENV value "${nodeEnv}"`);
    }

    return nodeEnv;
  }
}
