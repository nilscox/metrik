// prettier-ignore
export const configVariable = [
  'LISTEN_HOST',
  'LISTEN_PORT',
  'STORE',
  'DATABASE_FILENAME',
] as const;

export type ConfigVariable = typeof configVariable[number];

export abstract class ConfigPort {
  abstract get(key: ConfigVariable): string;
}
