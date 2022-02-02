import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dotenv from 'dotenv-safe';
import expect from 'expect';
import { Plugin as SuperAgentPlugin } from 'superagent';
import request, { SuperAgentTest } from 'supertest';

import { ProjectStore, ProjectStoreToken } from '../project_/domain/project.store';

import { AppModule } from './app.module';
import { DatabaseService } from './common/database/database.service';
import { Logger, LoggerModule } from './common/logger';
import { DevNullLogger } from './common/logger/dev-null-logger';
import { Credentials } from './modules/authentication/domain/credentials';
import { createUser } from './modules/user/domain/user';
import { UserStore, UserStoreToken } from './modules/user/domain/user.store';

dotenv.config({ path: '.env.test' });

describe('e2e', () => {
  let db: DatabaseService;
  let userStore: UserStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, LoggerModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    db = app.get(DatabaseService);
    userStore = app.get<UserStore>(UserStoreToken);

    await db.runMigrations();

    agent = request.agent(app.getHttpServer());
  });

  after(async () => {
    await db.closeConnection();
    await app?.close();
  });

  beforeEach(async () => {
    await db.clear();
  });

  it('a user signs up, logs out and logs back in', async () => {
    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    const asUser: SuperAgentPlugin = (req) => {
      req.set('Authorization', `Beer ${user.token}`);
    };

    let { body: user } = await agent.post('/auth/signup').send(credentials).expect(201);

    await agent.get('/auth/me').use(asUser).expect(200);
    await agent.post('/auth/logout').use(asUser).expect(204);
    await agent.get('/auth/me').use(asUser).expect(401);

    ({ body: user } = await agent.post('/auth/login').send(credentials).expect(200));

    await agent.get('/auth/me').use(asUser).expect(200);
  });

  it('a user logs in, creates a project and fetches its last metrics', async () => {
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

    await agent
      .post(`/project/${project.id}/metric`)
      .send({ label: 'Lines of code', unit: 'number', type: 'integer' })
      .expect(204);

    await agent
      .post(`/project/${project.id}/metric`)
      .send({ label: 'Overall coverage', unit: 'percent', type: 'float' })
      .expect(204);

    await agent
      .post(`/project/${project.id}/metrics-snapshot`)
      .send({ reference: 'commit-sha', metrics: [{ label: 'Lines of code', value: 42 }] })
      .expect(204);

    await agent
      .post(`/project/${project.id}/metrics-snapshot`)
      .send({
        metrics: [
          { label: 'Lines of code', value: 43 },
          { label: 'Overall coverage', value: 0.96 },
        ],
      })
      .expect(204);

    const dbProject = await app.get<ProjectStore>(ProjectStoreToken).findById(project.id);

    expect(dbProject).toEqual({
      props: {
        id: project.id,
        name: 'My project',
        defaultBranch: 'master',
        metricsConfig: [
          { props: { label: 'Lines of code', unit: 'number', type: 'integer' } },
          { props: { label: 'Overall coverage', unit: 'percent', type: 'float' } },
        ],
        snapshots: [
          {
            props: {
              id: expect.any(String),
              date: expect.any(Date),
              reference: 'commit-sha',
              metrics: [{ label: 'Lines of code', value: 42 }],
            },
          },
          {
            props: {
              id: expect.any(String),
              date: expect.any(Date),
              metrics: [
                { label: 'Lines of code', value: 43 },
                { label: 'Overall coverage', value: 0.96 },
              ],
            },
          },
        ],
      },
    });
  });
});
