import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { UserStore, UserStoreToken } from '../authentication/domain/user.store';
import { MetriksRequest } from '../common/utils/metriks-request';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(@Inject(UserStoreToken) private readonly userStore: UserStore) {}

  async use(
    req: MetriksRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorizationHeader = req.headers.authorization;
    const match = /^Beer (.+)/.exec(authorizationHeader);

    if (authorizationHeader && !match) {
      throw new UnauthorizedException('invalid authorization header');
    }

    if (match) {
      const user = await this.userStore.findUserByToken(match[1]);

      if (!user) {
        throw new UnauthorizedException('invalid token');
      }

      req.user = user;
    }

    next();
  }
}
