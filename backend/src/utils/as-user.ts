import { Plugin } from 'superagent';

import { User } from '~/modules/user';

export const as =
  (user: User): Plugin =>
  (req) => {
    const { token } = user.props;

    if (!token) {
      throw new Error('user does not have a token');
    }

    req.set('Authorization', `Beer ${token}`);
  };
