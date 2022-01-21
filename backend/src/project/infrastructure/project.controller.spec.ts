import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import expect from 'expect';
import { fn } from 'jest-mock';
import request, { SuperAgentTest } from 'supertest';

import { createUser } from '../../authentication/domain/user';
import { UserStoreToken } from '../../authentication/domain/user.store';
import { AuthorizationModule } from '../../authorization/authorization.module';
import { ConfigPort } from '../../common/config/config.port';
import { StubConfigAdapter } from '../../common/config/stub-config.adapter';
import { as } from '../../common/utils/as-user';
import { MockFn } from '../../common/utils/mock-fn';
import { InMemoryUserStore } from '../../user/infrastructure/user-store/in-memory-user.store';
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
    await app.close();
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

    expect(projectService.createNewProject).toHaveBeenCalledWith(
      dto.name,
      dto.defaultBranch,
    );

    expect(createdProject).toEqual(project.getProps());
  });

  it('creates a new project with a default branch', async () => {
    const user = createUser({ token: 'token' });
    const dto: CreateProjectDto = {
      name: 'My project with a default branch',
    };

    projectService.createNewProject.mockResolvedValueOnce(project);

    await agent.post('/project').use(as(user)).send(dto).expect(201);

    expect(projectService.createNewProject).toHaveBeenCalledWith(
      dto.name,
      'master',
    );
  });
});
