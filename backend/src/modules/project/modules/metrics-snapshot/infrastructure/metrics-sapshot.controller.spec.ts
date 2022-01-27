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

import {
  createProject,
  DuplicatedMetricError,
  InvalidMetricValueTypeError,
  UnknownMetricLabelError,
} from '../../../domain';
import { MetricsSnapshotService } from '../domain/metrics-snapshot.service';

import { CreateMetricsSnapshotDto } from './dtos/create-metrics-snapshot.dto';
import { MetricsSnapshotModule } from './metrics-snapshot.module';

class MockMetricsSnapshotService extends MetricsSnapshotService {
  override createMetricsSnapshot: MockFn<MetricsSnapshotService['createMetricsSnapshot']> = fn();
}

describe('MetricsSnapshotController', () => {
  let userStore: InMemoryUserStore;
  let metricsSnapshotService: MockMetricsSnapshotService;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorizationModule, MetricsSnapshotModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'memory' }))
      .overrideProvider(MetricsSnapshotService)
      .useClass(MockMetricsSnapshotService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(() => {
    userStore = app.get(UserStoreToken);
    metricsSnapshotService = app.get(MetricsSnapshotService);
    agent = request.agent(app.getHttpServer());
  });

  const user = createUser({ token: 'token' });
  const project = createProject();

  beforeEach(async () => {
    await userStore.saveUser(user);
  });

  describe('createMetricsSnapshot', () => {
    const endpoint = `/project/${project.id}/metrics-snapshot`;
    const dto: CreateMetricsSnapshotDto = {
      metrics: [{ label: 'label', value: 42 }],
    };

    it("creates a new snapshot of the project's metrics", async () => {
      await agent.post(endpoint).use(as(user)).send(dto).expect(HttpStatus.NO_CONTENT);

      expect(metricsSnapshotService.createMetricsSnapshot).toHaveBeenCalledWith(
        project.id,
        undefined,
        dto.metrics,
      );
    });

    it("creates a new snapshot of the project's metrics with a reference", async () => {
      const reference = 'ref';

      await agent
        .post(endpoint)
        .use(as(user))
        .send({ ...dto, reference })
        .expect(HttpStatus.NO_CONTENT);

      expect(metricsSnapshotService.createMetricsSnapshot).toHaveBeenCalledWith(
        project.id,
        reference,
        dto.metrics,
      );
    });

    it('handles the UnknownMetricLabelError domain error', async () => {
      const error = new UnknownMetricLabelError('label');

      metricsSnapshotService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'unknown metric label "label"');
    });

    it('handles the InvalidMetricValueTypeError domain error', async () => {
      const error = new InvalidMetricValueTypeError(4.2, 'integer');

      metricsSnapshotService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'invalid metric value "4.2", expected type "integer"');
    });

    it('handles the DuplicatedMetricError domain error', async () => {
      const error = new DuplicatedMetricError('label');

      metricsSnapshotService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'duplicated metric with label "label"');
    });

    it('fails when unauthenticated', async () => {
      await agent.post(endpoint).expect(HttpStatus.UNAUTHORIZED);
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).use(as(user)).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).use(as(user)).send({}).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
