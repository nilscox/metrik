import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv-safe';
import request, { SuperAgentTest } from 'supertest';

import db from '~/sql/database';

import { AppModule } from './app.module';
import { Credentials } from './modules/authentication/domain/credentials';
import { createUser } from './modules/user/domain/user';
import { UserStore, UserStoreToken } from './modules/user/domain/user.store';

dotenv.config({ path: '.env.test' });

describe('e2e', () => {
  let userStore: UserStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userStore = app.get<UserStore>(UserStoreToken);

    agent = request.agent(app.getHttpServer());
  });

  beforeEach(async () => {
    await db.deleteFrom('user').execute();
    await db.deleteFrom('project').execute();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('a user logs in, creates a project and its last metrics', async () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$QB2yC/AtXUMZA3mxOahcjuETGF6rOkpJXnKQY3LIlPJHmhOWai5aO';
    const user = createUser({ email: credentials.email, hashedPassword });

    await userStore.saveUser(user);

    const loginResponse = await agent.post('/auth/login').send(credentials).expect(200);
    const token = loginResponse.body.token;

    agent.use((req) => {
      req.set('Authorization', `Beer ${token}`);
    });

    const { body: project } = await agent.post('/project').send({ name: 'My project' }).expect(201);
    project;
  });
});
