import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { ConfigPort, StubConfigAdapter } from '~/common/config';
import { AuthorizationModule } from '~/modules/authorization';
import { createUser, InMemoryUserStore, UserStoreToken } from '~/modules/user';
import { as } from '~/utils/as-user';
import { MockFn } from '~/utils/mock-fn';

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

    it('prevents an authenticated user to log in again', async () => {
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
