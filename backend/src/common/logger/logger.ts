/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

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

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  error(message: any, ...optionalParams: any[]) {
    this._log('error', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this._log('warn', message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this._log('info', message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this._log('log', message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this._log('verbose', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this._log('debug', message, ...optionalParams);
  }

  protected _log(level: string, message: any, ...optionalParams: any[]) {
    const context = optionalParams[0] ?? this.context;
    // const params = optionalParams.map(String).join(' ');

    const brackets = (text?: string) => {
      if (text) {
        return [colors.dim('[') + text + colors.dim(']')].join('');
      }
    };

    const levelColor: Record<string, keyof typeof colors> = {
      error: 'fgRed',
      warn: 'fgYellow',
      info: 'fgBlue',
      log: 'fgCyan',
      verbose: 'fgMagenta',
      debug: 'fgYellow',
    };

    console.log(
      [
        brackets(colors.dim(this.date)),
        brackets(colors.bright(colors[levelColor[level]](level))),
        context && brackets(colors.bright(context)),
        message,
        // params,
      ]
        .filter((str) => str)
        .map(String)
        .join(' '),
    );
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
