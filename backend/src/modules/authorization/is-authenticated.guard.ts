import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MetriksRequest } from '~/utils/metriks-request';

@Injectable()
export class IsAuthenticated implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: MetriksRequest = context.switchToHttp().getRequest();

    return req.user !== undefined;
  }
}
