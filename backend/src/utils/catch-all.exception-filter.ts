import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ConfigPort } from '~/common/config';
import { Logger } from '~/common/logger';

@Catch()
export class CatchAllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly config: ConfigPort,
    private readonly logger: Logger,
  ) {
    this.logger.setContext('ExceptionHandler');
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(message, exception);

    const responseBody: Record<string, unknown> = {
      message,
      status,
    };

    if (this.config.env() === 'development') {
      responseBody.details = exception;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
