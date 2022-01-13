import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MetriksRequest } from '../../authentication/infrastructure/metriks-request';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: MetriksRequest = context.switchToHttp().getRequest();

    return req.user !== undefined;
  }
}
