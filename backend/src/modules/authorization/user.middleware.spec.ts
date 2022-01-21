import expect from 'expect';
import { Response } from 'express';
import { fn } from 'jest-mock';

import { createUser, InMemoryUserStore } from '~/modules/user';
import { MetriksRequest } from '~/utils/metriks-request';

import { UserMiddleware } from './user.middleware';

describe('UserMiddleware', () => {
  const next = fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('sets the user according to the authorization header', async () => {
    const userStore = new InMemoryUserStore();
    const userMiddleware = new UserMiddleware(userStore);

    const token = 'some-token';
    const user = createUser({ token });

    userStore.saveUser(user);

    const headers = { authorization: `Beer ${token}` };
    const req = { headers } as MetriksRequest;
    const res = {} as Response;

    await userMiddleware.use(req, res, next);

    expect(req.user).toEqual(user);

    expect(next).toHaveBeenCalled();
  });

  it('only calls next when the authorization header is not set', async () => {
    const userMiddleware = new UserMiddleware(new InMemoryUserStore());

    const req = { headers: {} } as MetriksRequest;
    const res = {} as Response;

    await userMiddleware.use(req, res, next);

    expect(req.user).toBeUndefined();

    expect(next).toHaveBeenCalled();
  });

  it("throws when the authorization header does not match any user's token", async () => {
    const userMiddleware = new UserMiddleware(new InMemoryUserStore());

    const headers = { authorization: 'Beer some-token' };
    const req = { headers } as MetriksRequest;
    const res = {} as Response;

    await expect(() => userMiddleware.use(req, res, next)).rejects.toThrow('invalid token');

    expect(req.user).toBeUndefined();
  });

  it('throws when the authorization header does not match the expected format', async () => {
    const userMiddleware = new UserMiddleware(new InMemoryUserStore());

    const headers = { authorization: 'Bearer some-token' };
    const req = { headers } as MetriksRequest;
    const res = {} as Response;

    await expect(() => userMiddleware.use(req, res, next)).rejects.toThrow(
      'invalid authorization header',
    );

    expect(req.user).toBeUndefined();
  });
});
