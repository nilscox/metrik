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

import { MetricConfigurationLabelAlreadyExistsError } from '../../../domain/errors/metric-configuration-label-already-exists.error';
import { createProject } from '../../../domain/project';
import { MetricConfigurationService } from '../domain/metric-configuration.service';

import { AddMetricConfigurationDto } from './dtos/add-metric-configuration.dto';
import { MetricConfigurationModule } from './metric-configuration.module';

class MockMetricConfigurationService extends MetricConfigurationService {
  override addMetricConfiguration: MockFn<MetricConfigurationService['addMetricConfiguration']> =
    fn();
}

describe('MetricConfigurationController', () => {
  let userStore: InMemoryUserStore;
  let metricConfigurationService: MockMetricConfigurationService;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorizationModule, MetricConfigurationModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'memory' }))
      .overrideProvider(MetricConfigurationService)
      .useClass(MockMetricConfigurationService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(() => {
    userStore = app.get(UserStoreToken);
    metricConfigurationService = app.get(MetricConfigurationService);
    agent = request.agent(app.getHttpServer());
  });

  const user = createUser({ token: 'token' });
  const project = createProject();

  beforeEach(async () => {
    await userStore.saveUser(user);
  });

  describe('addMetricConfiguration', () => {
    const dto: AddMetricConfigurationDto = {
      label: 'Linter warnings',
      unit: 'number',
      type: 'integer',
    };

    const endpoint = `/project/${project.id}/metric`;

    it('adds a new metric configuration to a project', async () => {
      await agent.post(endpoint).use(as(user)).send(dto).expect(HttpStatus.NO_CONTENT);

      expect(metricConfigurationService.addMetricConfiguration).toHaveBeenCalledWith(
        project.id,
        dto.label,
        dto.unit,
        dto.type,
      );
    });

    it('handles the MetricConfigurationLabelAlreadyExistsError domain error', async () => {
      const error = new MetricConfigurationLabelAlreadyExistsError('CI time');

      metricConfigurationService.addMetricConfiguration.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.CONFLICT);

      expect(body).toMatchObject({
        message: 'a metric configuration with label "CI time" already exists',
      });
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
