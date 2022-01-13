import { Request } from 'express';

import { User } from '../domain/user';

export type MetriksRequest = Request & {
  user?: User;
};
