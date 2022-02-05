import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { MetriksRequest } from '~/utils/metriks-request';

export const AuthenticatedUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request: MetriksRequest = ctx.switchToHttp().getRequest();

  return request.user;
});
