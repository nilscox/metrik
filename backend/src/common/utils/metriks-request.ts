import { Request } from 'express';

import { User } from '../../authentication/domain/user';

export type MetriksRequest = Request & {
  user?: User;
};
