import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { MetriksRequest } from '~/utils/metriks-request';

@Injectable()
export class IsAuthenticated implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!this.isAuthenticated(context)) {
      throw new UnauthorizedException('you must be authenticated');
    }

    return true;
  }

  isAuthenticated(context: ExecutionContext): boolean {
    const req: MetriksRequest = context.switchToHttp().getRequest();

    return req.user !== undefined;
  }
}
