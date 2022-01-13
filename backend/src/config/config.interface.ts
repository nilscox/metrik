// prettier-ignore
export const configVariable = [
  'LISTEN_HOST',
  'LISTEN_PORT',
  'METRICS_STORE',
] as const;

export type ConfigVariable = typeof configVariable[number];

export interface Config {
  get(key: ConfigVariable): string;
}
