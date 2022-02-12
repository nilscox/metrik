import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { MetriksRequest } from '~/utils/metriks-request';

import { Logger } from './logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {
    this.logger.setContext('Request');
  }

  async use(req: MetriksRequest, res: Response, next: NextFunction): Promise<void> {
    const start = new Date().getTime();

    next();

    const end = new Date().getTime();
    const elapsed = end - start;

    this.logger.log([req.method, req.path, res.statusCode, `(${elapsed}ms)`].join(' '));
  }
}
