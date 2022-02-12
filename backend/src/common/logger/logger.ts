/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable, LoggerService, Scope } from '@nestjs/common';

import { ConfigPort } from '../config';

const colors = {
  reset: (text: string) => `\x1b[0m${text}\x1b[0m`,
  bright: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  underscore: (text: string) => `\x1b[4m${text}\x1b[0m`,
  blink: (text: string) => `\x1b[5m${text}\x1b[0m`,
  reverse: (text: string) => `\x1b[7m${text}\x1b[0m`,
  hidden: (text: string) => `\x1b[8m${text}\x1b[0m`,

  fgBlack: (text: string) => `\x1b[30m${text}\x1b[0m`,
  fgRed: (text: string) => `\x1b[31m${text}\x1b[0m`,
  fgGreen: (text: string) => `\x1b[32m${text}\x1b[0m`,
  fgYellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  fgBlue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  fgMagenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  fgCyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  fgWhite: (text: string) => `\x1b[37m${text}\x1b[0m`,

  bgBlack: (text: string) => `\x1b[40m${text}\x1b[0m`,
  bgRed: (text: string) => `\x1b[41m${text}\x1b[0m`,
  bgGreen: (text: string) => `\x1b[42m${text}\x1b[0m`,
  bgYellow: (text: string) => `\x1b[43m${text}\x1b[0m`,
  bgBlue: (text: string) => `\x1b[44m${text}\x1b[0m`,
  bgMagenta: (text: string) => `\x1b[45m${text}\x1b[0m`,
  bgCyan: (text: string) => `\x1b[46m${text}\x1b[0m`,
  bgWhite: (text: string) => `\x1b[47m${text}\x1b[0m`,
};

type LogLevel = typeof Logger.logLevels[number];

function isLogLevel(str: string): str is LogLevel {
  return Logger.logLevels.includes(str as LogLevel);
}

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  public static readonly logLevels = ['error', 'warn', 'info', 'log', 'debug'] as const;

  private level?: LogLevel;
  private context?: string;

  constructor(config: ConfigPort) {
    this.setLevel(config.get('LOG_LEVEL'));
  }

  private isLogLevelEnabled(level: LogLevel) {
    if (!this.level) {
      return false;
    }

    const index = Logger.logLevels.indexOf(this.level);

    return Logger.logLevels.slice(0, index + 1).includes(level);
  }

  disable() {
    this.level = undefined;
  }

  setLevel(level: string) {
    if (level === '') {
      this.level = undefined;
      return;
    }

    if (!isLogLevel(level)) {
      throw new Error(`invalid log level "${level}"`);
    }

    this.level = level;
  }

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, ...extra: any[]) {
    this._log('error', message, ...extra);
  }

  warn(message: string, ...extra: any[]) {
    this._log('warn', message, ...extra);
  }

  info(message: string, ...extra: any[]) {
    this._log('info', message, ...extra);
  }

  log(message: string, ...extra: any[]) {
    this._log('log', message, ...extra);
  }

  debug(message: string, ...extra: any[]) {
    this._log('debug', message, ...extra);
  }

  protected _log(level: LogLevel, message: string, ...extra: any[]) {
    if (!this.isLogLevelEnabled(level)) {
      return;
    }

    const brackets = (text?: string) => {
      if (text) {
        return [colors.dim('[') + text + colors.dim(']')].join('');
      }
    };

    let context = this.context;

    if (!context) {
      const idx = extra.reverse().findIndex((arg) => typeof arg === 'string');

      if (idx >= 0) {
        context = extra.splice(extra.length - idx - 1, 1)[0];
      }
    }

    const levelColor: Record<string, keyof typeof colors> = {
      error: 'fgRed',
      warn: 'fgYellow',
      info: 'fgGreen',
      log: 'fgBlue',
      debug: 'fgYellow',
    };

    console.log(
      [
        brackets(this.date),
        brackets(colors.bright(colors[levelColor[level]](level)))?.padEnd(40, ' '),
        context && brackets(colors.bright(context)),
        message,
      ]
        .filter((str) => str)
        .map(String)
        .join(' '),
    );

    for (const arg of extra) {
      console.log(arg);
    }
  }

  private get date() {
    const now = new Date();

    return [
      [now.getFullYear(), now.getMonth() + 1, now.getDay()]
        .map((n) => String(n).padStart(2, '0'))
        .join('-'),
      [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((n) => String(n).padStart(2, '0'))
        .join(':'),
    ].join(' ');
  }
}
