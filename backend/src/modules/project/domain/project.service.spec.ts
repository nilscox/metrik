import expect from 'expect';

import { StubGeneratorAdapter } from '~/common/generator';

import { InMemoryProjectStore } from '../project-aggregate';

import { ProjectProps } from './project';
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

  const find = async (id: string) => {
    return projectStore.findByIdOrFail(id);
  };

  it('creates a new project', async () => {
    const createdProject = await service.createNewProject('project name', 'master');

    const expected: ProjectProps = {
      id: 'generated-id',
      name: 'project name',
      defaultBranch: 'master',
      metricsConfig: [],
      snapshots: [],
    };

    expect(createdProject.getProps()).toEqual(expected);

    const savedProject = await find(createdProject.id);
    expect(savedProject?.getProps()).toEqual(expected);
  });
});
