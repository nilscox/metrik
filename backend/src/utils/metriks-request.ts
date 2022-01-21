import { Request } from 'express';

import { User } from '~/user';

export type MetriksRequest = Request & {
  user?: User;
};
