import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { ConfigPort, StubConfigAdapter } from '~/common/config';
import { AuthorizationModule } from '~/modules/authorization';
import { createUser, InMemoryUserStore, UserStoreToken } from '~/modules/user';
import { as } from '~/utils/as-user';
import { MockFn } from '~/utils/mock-fn';

import { createProject } from '../domain/project';
import { ProjectService } from '../domain/project.service';

import { CreateProjectDto } from './create-project.dto';
import { ProjectModule } from './project.module';

class MockProjectService extends ProjectService {
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

  it('creates a new project', async () => {
    const dto: CreateProjectDto = {
      name: 'My project',
      defaultBranch: 'pied',
    };

    projectService.createNewProject.mockResolvedValueOnce(project);

    const { body: createdProject } = await agent
      .post('/project')
      .use(as(user))
      .send(dto)
      .expect(201);

    expect(projectService.createNewProject).toHaveBeenCalledWith(dto.name, dto.defaultBranch);

    expect(createdProject).toEqual(project.getProps());
  });

  it('creates a new project with a default branch', async () => {
    const user = createUser({ token: 'token' });
    const dto: Partial<CreateProjectDto> = {
      name: 'My project with a default branch',
    };

    projectService.createNewProject.mockResolvedValueOnce(project);

    await agent.post('/project').use(as(user)).send(dto).expect(201);

    expect(projectService.createNewProject).toHaveBeenCalledWith(dto.name, 'master');
  });

  it('prevents to create a project without being authenticated', async () => {
    await agent.post('/project').expect(403);
  });
});
