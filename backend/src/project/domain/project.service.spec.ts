import expect from 'expect';

import { StubGeneratorAdapter } from '~/common/generator/stub-generator.adapter';

import { InMemoryProjectStore } from '../infrastructure/project-store/in-memory-project.store';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let projectStore: InMemoryProjectStore;
  let generator: StubGeneratorAdapter;
  let service: ProjectService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    generator = new StubGeneratorAdapter();
    service = new ProjectService(projectStore, generator);
  });

  it('creates a new project', async () => {
    const createdProject = await service.createNewProject('project name', 'master');

    expect(await projectStore.get(createdProject.id)).toMatchObject({
      name: 'project name',
      defaultBranch: 'master',
    });
  });
});
