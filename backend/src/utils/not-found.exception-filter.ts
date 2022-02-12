import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest();
    const status = exception.getStatus();

    const responseBody: Record<string, unknown> = {
      message: exception.message,
      status,
      path: req.path,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
