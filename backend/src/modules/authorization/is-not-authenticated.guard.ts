import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { IsAuthenticated } from './is-authenticated.guard';

@Injectable()
export class IsNotAuthenticated implements CanActivate {
  constructor(private readonly isAuthenticated: IsAuthenticated) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.isAuthenticated.isAuthenticated(context)) {
      throw new UnauthorizedException('you are already authenticated');
    }

    return true;
  }
}
