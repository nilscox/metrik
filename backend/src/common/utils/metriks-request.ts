import { Request } from 'express';

import { User } from '~/user/domain/user';

export type MetriksRequest = Request & {
  user?: User;
};
