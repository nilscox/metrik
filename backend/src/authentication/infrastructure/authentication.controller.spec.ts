import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { AuthorizationModule } from '~/authorization/authorization.module';
import { ConfigPort } from '~/common/config/config.port';
import { StubConfigAdapter } from '~/common/config/stub-config.adapter';
import { as } from '~/common/utils/as-user';
import { MockFn } from '~/common/utils/mock-fn';
import { createUser } from '~/user/domain/user';
import { UserStoreToken } from '~/user/domain/user.store';
import { InMemoryUserStore } from '~/user/infrastructure/user-store/in-memory-user.store';

import { AuthenticationService } from '../domain/authentication.service';
import { InvalidCredentialsError } from '../domain/authentication-errors';
import { Credentials } from '../domain/credentials';

import { AuthenticationModule } from './authentication.module';

class MockAuthenticationService extends AuthenticationService {
  override authenticate: MockFn<AuthenticationService['authenticate']> = fn();
}

describe('AuthenticationController', () => {
  let userStore: InMemoryUserStore;
  let authenticationService: MockAuthenticationService;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorizationModule, AuthenticationModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'memory' }))
      .overrideProvider(AuthenticationService)
      .useClass(MockAuthenticationService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  beforeEach(() => {
    userStore = app.get(UserStoreToken);
    authenticationService = app.get(AuthenticationService);
    agent = request.agent(app.getHttpServer());
  });

  describe('login', () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'password',
    };

    it('authenticates an existing user', async () => {
      const user = createUser({ token: 'token' });

      authenticationService.authenticate.mockResolvedValueOnce(user);

      const { body } = await agent.post('/auth/login').send(credentials).expect(HttpStatus.OK);

      expect(authenticationService.authenticate).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );

      expect(body).toEqual({
        id: user.id,
        email: credentials.email,
        token: 'token',
      });
    });

    it('handles the InvalidCredentials domain error', async () => {
      authenticationService.authenticate.mockRejectedValueOnce(new InvalidCredentialsError());

      const { body } = await agent
        .post('/auth/login')
        .send(credentials)
        .expect(HttpStatus.UNAUTHORIZED);

      await expect(body).toMatchObject({
        message: 'invalid email password combinaison',
      });
    });

    it('prevents a user who is already logged in to log in again', async () => {
      const user = createUser({ token: 'token' });

      await userStore.saveUser(user);

      const { body } = await agent
        .post('/auth/login')
        .use(as(user))
        .send(credentials)
        .expect(HttpStatus.UNAUTHORIZED);

      await expect(body).toMatchObject({
        message: 'you are already authenticated',
      });
    });
  });
});
