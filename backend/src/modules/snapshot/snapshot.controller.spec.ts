import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { ConfigPort, StubConfigAdapter } from '~/common/config';
import { DatePort, StubDateAdapter } from '~/common/date';
import { DevNullLogger } from '~/common/logger';
import { as } from '~/utils/as-user';
import { MockFn } from '~/utils/mock-fn';

import { AuthenticationService } from '../authentication/application/authentication.service';
import { AuthorizationModule } from '../authorization';
import { createMetric } from '../metric/domain/metric';
import { ProjectStoreToken } from '../project';
import { createProject } from '../project/domain/project';
import { InMemoryProjectStore } from '../project/persistence/in-memory-project.store';
import { createUser, InMemoryUserStore, UserStoreToken } from '../user';

import { SnapshotService } from './application/snapshot.service';
import { SnapshotModule } from './snapshot.module';

class MockSnapshotService extends SnapshotService {
  override createSnapshot: MockFn<SnapshotService['createSnapshot']> = fn();
}

describe('SnapshotController', () => {
  let dateProvider: StubDateAdapter;

  let userStore: InMemoryUserStore;
  let projectStore: InMemoryProjectStore;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorizationModule, SnapshotModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter())
      .overrideProvider(DatePort)
      .useClass(StubDateAdapter)
      .overrideProvider(AuthenticationService)
      .useClass(MockSnapshotService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(() => {
    dateProvider = app.get(DatePort);
    userStore = app.get(UserStoreToken);
    projectStore = app.get(ProjectStoreToken);
    agent = request.agent(app.getHttpServer());
  });

  it('creates a snapshot', async () => {
    const now = new Date();

    dateProvider.now = now;

    const user = createUser({ token: 'token' });
    const metric = createMetric();
    const project = createProject({ metrics: [metric] });

    await userStore.save(user);
    await projectStore.save(project);

    const { body: snapshot } = await agent
      .post(`/project/${project.props.id}/metrics-snapshot`)
      .use(as(user))
      .send({
        branch: 'master',
        ref: 'commit',
        metrics: [{ metricId: metric.props.id, value: 42 }],
      })
      .expect(HttpStatus.CREATED);

    expect(snapshot).toEqual({
      id: expect.any(String),
      branch: 'master',
      ref: 'commit',
      date: now.toISOString(),
      metrics: [
        {
          metricId: 'metricId',
          value: 42,
        },
      ],
    });
  });
});
