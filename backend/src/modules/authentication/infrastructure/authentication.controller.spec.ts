import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { ConfigPort, StubConfigAdapter } from '~/common/config';
import { DatabaseService } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { AuthorizationModule } from '~/modules/authorization';
import { createUser, InMemoryUserStore, UserStoreToken } from '~/modules/user';
import { as } from '~/utils/as-user';
import { MockFn } from '~/utils/mock-fn';

import { AuthenticationService } from '../domain/authentication.service';
import { EmailAlreadyExistsError, InvalidCredentialsError } from '../domain/authentication-errors';
import { Credentials } from '../domain/credentials';

import { AuthenticationModule } from './authentication.module';

class MockAuthenticationService extends AuthenticationService {
  override createUser: MockFn<AuthenticationService['createUser']> = fn();
  override authenticate: MockFn<AuthenticationService['authenticate']> = fn();
  override revokeAuthentication: MockFn<AuthenticationService['revokeAuthentication']> = fn();
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
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter())
      .overrideProvider(AuthenticationService)
      .useClass(MockAuthenticationService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    await app.get(DatabaseService).runMigrations();
  });

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(() => {
    userStore = app.get(UserStoreToken);
    authenticationService = app.get(AuthenticationService);
    agent = request.agent(app.getHttpServer());
  });

  const credentials: Credentials = {
    email: 'user@domain.tld',
    password: 'password',
  };

  describe('signup', () => {
    const endpoint = '/auth/signup';

    it('signs up as a new user', async () => {
      const user = createUser({ token: 'token' });

      authenticationService.createUser.mockResolvedValueOnce(user);

      await agent.post(endpoint).send(credentials).expect(HttpStatus.CREATED);

      expect(authenticationService.createUser).toHaveBeenCalledWith(
        credentials.email,
        credentials.password,
      );
    });

    it('handles the EmailAlreadyExistsError domain error', async () => {
      const error = new EmailAlreadyExistsError(credentials.email);

      authenticationService.createUser.mockRejectedValue(error);

      await agent.post(endpoint).send(credentials).expect(HttpStatus.CONFLICT);
    });

    it('fails when an authenticated user tries to to signup', async () => {
      const user = createUser({ token: 'token' });

      await userStore.save(user);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(credentials)
        .expect(HttpStatus.UNAUTHORIZED);

      await expect(body).toMatchObject({
        message: 'you are already authenticated',
      });
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).send({}).expect(HttpStatus.BAD_REQUEST);
    });

    it('fails when the email is too short', async () => {
      await agent
        .post(endpoint)
        .send({ ...credentials, password: 'short' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('login', () => {
    const endpoint = '/auth/login';

    it('authenticates an existing user', async () => {
      const user = createUser({ token: 'token' });

      authenticationService.authenticate.mockResolvedValueOnce(user);

      const { body } = await agent.post(endpoint).send(credentials).expect(HttpStatus.OK);

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

      const { body } = await agent.post(endpoint).send(credentials).expect(HttpStatus.UNAUTHORIZED);

      await expect(body).toMatchObject({
        message: 'invalid email password combinaison',
      });
    });

    it('fails when an authenticated user tries to login again', async () => {
      const user = createUser({ token: 'token' });

      await userStore.save(user);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(credentials)
        .expect(HttpStatus.UNAUTHORIZED);

      await expect(body).toMatchObject({
        message: 'you are already authenticated',
      });
    });

    it('fails to login when the request body is not valid', async () => {
      await agent.post(endpoint).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).send({}).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('logout', () => {
    const endpoint = '/auth/logout';

    it('logs out as an authenticated user', async () => {
      const user = createUser({ token: 'token' });

      await userStore.save(user);
      authenticationService.authenticate.mockResolvedValueOnce(user);

      await agent.post(endpoint).use(as(user)).expect(HttpStatus.NO_CONTENT);

      expect(authenticationService.revokeAuthentication).toHaveBeenCalledWith(user);
    });

    it('fails when an unauthenticated user tries to logout', async () => {
      await agent.post(endpoint).send(credentials).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('getUser', () => {
    const endpoint = '/auth/me';

    it('retrieves the user currently authenticated', async () => {
      const user = createUser({ email: credentials.email, token: 'token' });

      await userStore.save(user);

      const { body } = await agent.get(endpoint).use(as(user)).expect(HttpStatus.OK);

      expect(body).toEqual({
        id: user.id,
        email: credentials.email,
        token: 'token',
      });
    });

    it('fails to retrieve the authenticated user when unauthenticated', async () => {
      await agent.get(endpoint).expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
