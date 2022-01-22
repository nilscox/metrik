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

import { DuplicatedMetricError } from '../domain/duplicated-metric.error';
import { InvalidMetricValueTypeError } from '../domain/invalid-metric-value-type.error';
import { MetricConfigurationLabelAlreadyExistsError } from '../domain/metric-configuration-label-already-exists.error';
import { createProject } from '../domain/project';
import { ProjectService } from '../domain/project.service';
import { UnknownMetricLabelError } from '../domain/unknown-metric-label.error';

import { AddMetricConfigurationDto } from './add-metric-configuration.dto';
import { CreateMetricsSnapshotDto } from './create-metrics-snapshot.dto';
import { CreateProjectDto } from './create-project.dto';
import { ProjectModule } from './project.module';

class MockProjectService extends ProjectService {
  override createNewProject: MockFn<ProjectService['createNewProject']> = fn();
  override addMetricConfiguration: MockFn<ProjectService['addMetricConfiguration']> = fn();
  override createMetricsSnapshot: MockFn<ProjectService['createMetricsSnapshot']> = fn();
}

describe('ProjectController', () => {
  let userStore: InMemoryUserStore;
  let projectService: MockProjectService;
  let app: INestApplication;

  let agent: SuperAgentTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorizationModule, ProjectModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new StubConfigAdapter({ STORE: 'memory' }))
      .overrideProvider(ProjectService)
      .useClass(MockProjectService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  beforeEach(() => {
    userStore = app.get(UserStoreToken);
    projectService = app.get(ProjectService);
    agent = request.agent(app.getHttpServer());
  });

  const user = createUser({ token: 'token' });
  const project = createProject();

  beforeEach(async () => {
    await userStore.saveUser(user);
  });

  describe('createProject', () => {
    const endpoint = '/project';

    it('creates a new project', async () => {
      const dto: CreateProjectDto = {
        name: 'My project',
        defaultBranch: 'pied',
      };

      projectService.createNewProject.mockResolvedValueOnce(project);

      const { body: createdProject } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(projectService.createNewProject).toHaveBeenCalledWith(dto.name, dto.defaultBranch);

      expect(createdProject).toEqual(project.getProps());
    });

    it('creates a new project with a default branch', async () => {
      const dto: Partial<CreateProjectDto> = {
        name: 'My project with a default branch',
      };

      projectService.createNewProject.mockResolvedValueOnce(project);

      await agent.post(endpoint).use(as(user)).send(dto).expect(HttpStatus.CREATED);

      expect(projectService.createNewProject).toHaveBeenCalledWith(dto.name, 'master');
    });

    it('fails when unauthenticated', async () => {
      await agent.post(endpoint).expect(HttpStatus.FORBIDDEN);
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).use(as(user)).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).use(as(user)).send({}).expect(HttpStatus.BAD_REQUEST);
    });
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

      expect(projectService.addMetricConfiguration).toHaveBeenCalledWith(
        project.id,
        dto.label,
        dto.unit,
        dto.type,
      );
    });

    it('handles the MetricConfigurationLabelAlreadyExistsError domain error', async () => {
      const error = new MetricConfigurationLabelAlreadyExistsError('CI time');

      projectService.addMetricConfiguration.mockRejectedValueOnce(error);

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
      await agent.post(endpoint).expect(HttpStatus.FORBIDDEN);
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).use(as(user)).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).use(as(user)).send({}).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('createMetricsSnapshot', () => {
    const endpoint = `/project/${project.id}/metrics-snapshot`;
    const dto: CreateMetricsSnapshotDto = {
      metrics: [{ label: 'label', value: 42 }],
    };

    it("creates a new snapshot of the project's metrics", async () => {
      await agent.post(endpoint).use(as(user)).send(dto).expect(HttpStatus.NO_CONTENT);

      expect(projectService.createMetricsSnapshot).toHaveBeenCalledWith(project.id, dto.metrics);
    });

    it('handles the UnknownMetricLabelError domain error', async () => {
      const error = new UnknownMetricLabelError('label');

      projectService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'unknown metric label "label"');
    });

    it('handles the InvalidMetricValueTypeError domain error', async () => {
      const error = new InvalidMetricValueTypeError(4.2, 'integer');

      projectService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'invalid metric value "4.2", expected type "integer"');
    });

    it('handles the DuplicatedMetricError domain error', async () => {
      const error = new DuplicatedMetricError('label');

      projectService.createMetricsSnapshot.mockRejectedValueOnce(error);

      const { body } = await agent
        .post(endpoint)
        .use(as(user))
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(body).toHaveProperty('message', 'duplicated metric with label "label"');
    });

    it('fails when unauthenticated', async () => {
      await agent.post(endpoint).expect(HttpStatus.FORBIDDEN);
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).use(as(user)).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).use(as(user)).send({}).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
