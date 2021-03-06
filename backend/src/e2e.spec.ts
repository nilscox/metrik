import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import expect from 'expect';
import { Plugin as SuperAgentPlugin } from 'superagent';
import request, { SuperAgentTest } from 'supertest';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';

import { AppModule } from './app.module';
import { ConfigPort } from './common/config';
import { TestConfigAdapter } from './common/config/test-config.adapter';
import { DatabaseService } from './common/database';
import { DatePort, StubDateAdapter } from './common/date';
import { LoggerModule } from './common/logger';
import { Credentials } from './modules/authentication';
import { Metric } from './modules/metric';
import { Project, ProjectStore, ProjectStoreToken } from './modules/project';
import { ProjectName } from './modules/project/domain/project-name';
import { Snapshot, SnapshotStore, SnapshotStoreToken } from './modules/snapshot';
import { createUser, UserStore, UserStoreToken } from './modules/user';
import { logResponse } from './utils/log-request';

logResponse;

describe('e2e', () => {
  let db: DatabaseService;
  let userStore: UserStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, LoggerModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new TestConfigAdapter({ STORE: 'sql', LOG_LEVEL: '' }))
      .overrideProvider(DatePort)
      .useClass(StubDateAdapter)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    db = app.get(DatabaseService);
    userStore = app.get(UserStoreToken);

    agent = request.agent(app.getHttpServer());
  });

  after(async () => {
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

  it('a user logs in, creates a project and adds two snapshots', async () => {
    const dateAdapter = app.get<StubDateAdapter>(DatePort);

    const credentials: Credentials = {
      email: 'user@domain.tld',
      password: 'some password',
    };

    // prettier-ignore
    // cSpell:disable-next-line
    const hashedPassword = '$2b$10$QB2yC/AtXUMZA3mxOahcjuETGF6rOkpJXnKQY3LIlPJHmhOWai5aO';
    const user = createUser({ email: credentials.email, hashedPassword });

    await userStore.save(user);

    const loginResponse = await agent.post('/auth/login').send(credentials).expect(200);
    const token = loginResponse.body.token;

    agent.use((req) => {
      req.set('Authorization', `Beer ${token}`);
    });

    const { body: project } = await agent.post('/project').send({ name: 'My project' }).expect(201);

    const { body: metric1 } = await agent
      .post(`/project/${project.id}/metric`)
      .send({ label: 'Lines of code', type: 'number' })
      .expect(201);

    const { body: metric2 } = await agent
      .post(`/project/${project.id}/metric`)
      .send({ label: 'Overall coverage', type: 'percentage' })
      .expect(201);

    await agent
      .get(`/project/${project.id}`)
      .expect(200)
      .expect(({ body }) =>
        expect(body).toEqual({
          id: project.id,
          name: 'My project',
          defaultBranch: 'master',
          branches: [
            {
              id: expect.any(String),
              name: 'master',
            },
          ],
          metrics: [
            {
              id: metric1.id,
              label: 'Lines of code',
              type: 'number',
            },
            {
              id: metric2.id,
              label: 'Overall coverage',
              type: 'percentage',
            },
          ],
        }),
      );

    const firstSnapshotDate = new Date('2022-01-01');
    dateAdapter.now = firstSnapshotDate;

    const { body: snapshot1 } = await agent
      .post(`/project/${project.id}/metrics-snapshot`)
      .send({
        branch: 'master',
        ref: 'ref1',
        metrics: [{ metricId: metric1.id, value: 42 }],
      })
      .expect(201);

    const secondSnapshotDate = new Date('2022-01-02');
    dateAdapter.now = secondSnapshotDate;

    const { body: snapshot2 } = await agent
      .post(`/project/${project.id}/metrics-snapshot`)
      .send({
        branch: 'master',
        ref: 'ref2',
        metrics: [
          { metricId: metric1.id, value: 43 },
          { metricId: metric2.id, value: 0.96 },
        ],
      })
      .expect(201);

    const dbProject = await app.get<ProjectStore>(ProjectStoreToken).findByIdOrFail(project.id);
    const branch = dbProject.props.defaultBranch;

    const dbSnapshots = await app
      .get<SnapshotStore>(SnapshotStoreToken)
      .findAllForProjectId(project.id);

    const expectedProject = new Project({
      id: project.id,
      name: new ProjectName('My project'),
      defaultBranch: branch,
      metrics: [
        Metric.create({
          id: metric1.id,
          label: 'Lines of code',
          type: MetricTypeEnum.number,
          projectId: project.id,
        }),
        Metric.create({
          id: metric2.id,
          label: 'Overall coverage',
          type: MetricTypeEnum.percentage,
          projectId: project.id,
        }),
      ],
    });

    expect(dbProject).toEqual(expectedProject);

    expect(dbSnapshots).toEqual([
      Snapshot.create({
        id: snapshot1.id,
        branch,
        ref: 'ref1',
        date: firstSnapshotDate,
        metrics: [
          {
            id: expect.any(String) as unknown as string,
            metricId: metric1.id,
            value: 42,
          },
        ],
      }),
      Snapshot.create({
        id: snapshot2.id,
        branch,
        ref: 'ref2',
        date: secondSnapshotDate,
        metrics: [
          {
            id: expect.any(String) as unknown as string,
            metricId: metric1.id,
            value: 43,
          },
          {
            id: expect.any(String) as unknown as string,
            metricId: metric2.id,
            value: 0.96,
          },
        ],
      }),
    ]);
  });
});
