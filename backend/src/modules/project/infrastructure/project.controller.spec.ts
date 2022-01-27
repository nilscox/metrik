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
  createMetricsConfiguration,
  createMetricsSnapshot,
  createProject,
} from '../domain/project';
import { ProjectService } from '../domain/project.service';

import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectModule } from './project.module';

class MockProjectService extends ProjectService {
  override findProjectById: MockFn<ProjectService['findProjectById']> = fn();
  override createNewProject: MockFn<ProjectService['createNewProject']> = fn();
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
});
