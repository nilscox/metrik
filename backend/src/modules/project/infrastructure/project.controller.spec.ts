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
import {
  createMetricsConfiguration,
  createMetricsSnapshot,
  createProject,
} from '../domain/project';
import { ProjectService } from '../domain/project.service';
import { UnknownMetricLabelError } from '../domain/unknown-metric-label.error';

import { CreateMetricsSnapshotDto } from './create-metrics-snapshot.dto';
import { CreateProjectDto } from './create-project.dto';
import { ProjectModule } from './project.module';

class MockProjectService extends ProjectService {
  override findProjectById: MockFn<ProjectService['findProjectById']> = fn();
  override createNewProject: MockFn<ProjectService['createNewProject']> = fn();
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

  describe('getProject', () => {
    const endpoint = `/project/${project.id}`;

    it('fetches an existing project', async () => {
      const project = createProject({
        id: 'project-id',
        name: 'My project',
        defaultBranch: 'dev',
        metricsConfig: [
          createMetricsConfiguration({ label: 'CI time', type: 'number', unit: 'seconds' }),
        ],
        snapshots: [
          createMetricsSnapshot({
            id: 'snapshot-id',
            reference: 'ref',
            date: new Date('2022-01-01'),
            metrics: [{ label: 'CI time', value: 42 }],
          }),
        ],
      });

      projectService.findProjectById.mockResolvedValueOnce(project);

      const { body: fetchedProject } = await agent
        .get(endpoint)
        .use(as(user))
        .expect(HttpStatus.OK);

      expect(fetchedProject).toEqual({
        id: 'project-id',
        name: 'My project',
        defaultBranch: 'dev',
        metricsConfig: [{ label: 'CI time', type: 'number', unit: 'seconds' }],
        snapshots: [
          {
            id: 'snapshot-id',
            reference: 'ref',
            date: '2022-01-01T00:00:00.000Z',
            metrics: [{ label: 'CI time', value: 42 }],
          },
        ],
      });
    });
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
      await agent.post(endpoint).expect(HttpStatus.UNAUTHORIZED);
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

      expect(projectService.createMetricsSnapshot).toHaveBeenCalledWith(
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

      expect(projectService.createMetricsSnapshot).toHaveBeenCalledWith(
        project.id,
        reference,
        dto.metrics,
      );
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
      await agent.post(endpoint).expect(HttpStatus.UNAUTHORIZED);
    });

    it('fails when the request body is not valid', async () => {
      await agent.post(endpoint).use(as(user)).expect(HttpStatus.BAD_REQUEST);
      await agent.post(endpoint).use(as(user)).send({}).expect(HttpStatus.BAD_REQUEST);
    });
  });
});
