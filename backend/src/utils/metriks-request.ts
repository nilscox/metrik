import { Request } from 'express';

import { User } from '~/modules/user';

export type MetriksRequest = Request & {
  user?: User;
};
