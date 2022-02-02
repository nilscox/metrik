import { Logger } from '../logger';

import { SimpleConsoleLogger } from './typeorm-console-logger';

export class DatabaseLogger extends SimpleConsoleLogger {
  constructor(private readonly logger: Logger, log = true) {
    super('all', (level, ...args) => {
      // typeorm logs "All classes found using provider glob..." even when logging is false
      if (log) {
        this.logger[level === 'warn' ? 'warn' : 'log'](args.map(String).join(' '));
      }
    });

    this.logger.setContext('Database');
  }
}
