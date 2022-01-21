import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import expect from 'expect';
import { fn, Mock } from 'jest-mock';

import { ConfigPort } from '../../common/config/config.port';
import { StubConfigAdapter } from '../../common/config/stub-config.adapter';
import { AuthenticationService } from '../domain/authentication.service';
import { InvalidCredentialsError } from '../domain/authentication-errors';
import { Credentials } from '../domain/credentials';
import { createUser } from '../domain/user';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationModule } from './authentication.module';

type MockFn<T extends (...args: unknown[]) => unknown> = Mock<
  ReturnType<T>,
  Parameters<T>
>;

class MockAuthenticationService extends AuthenticationService {
  override authenticate: MockFn<AuthenticationService['authenticate']> = fn();
}

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authenticationService: MockAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'memory' }))
      .overrideProvider(AuthenticationService)
      .useClass(MockAuthenticationService)
      .compile();

    controller = module.get(AuthenticationController);
    authenticationService = module.get(AuthenticationService);
  });

  describe('login', () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'password',
    };

    it('authenticates an existing user', async () => {
      const user = createUser({ token: 'token' });

      authenticationService.authenticate.mockResolvedValueOnce(user);

      const loggedInUser = await controller.login(credentials);
      const outputDto = instanceToPlain(loggedInUser);

      expect(outputDto).toEqual({
        id: user.id,
        email: credentials.email,
        token: 'token',
      });
    });

    it('handles the InvalidCredentials domain error', async () => {
      authenticationService.authenticate.mockRejectedValueOnce(
        new InvalidCredentialsError(),
      );

      await expect(controller.login(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('prevents a user who is already logged in to log in again', async () => {
      const user = createUser();

      await expect(controller.login(credentials, user)).rejects.toThrow(
        'you are already authenticated',
      );
    });
  });
});
