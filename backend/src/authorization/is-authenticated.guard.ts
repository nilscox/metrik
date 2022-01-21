import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MetriksRequest } from '../common/utils/metriks-request';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: MetriksRequest = context.switchToHttp().getRequest();

    return req.user !== undefined;
  }
}
