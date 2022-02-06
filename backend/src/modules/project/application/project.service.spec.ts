import expect from 'expect';

import { GeneratorPort, StubGeneratorAdapter } from '~/common/generator';
import { BranchStore, InMemoryBranchStore } from '~/modules/branch';

import { InMemoryProjectStore } from '../persistence/in-memory-project.store';

import { ProjectService } from './project.service';
import { ProjectStore } from './project.store';

describe('ProjectService', () => {
  let generator: GeneratorPort;
  let projectStore: ProjectStore;
  let branchStore: BranchStore;
  let projectService: ProjectService;

  beforeEach(() => {
    generator = new StubGeneratorAdapter();
    projectStore = new InMemoryProjectStore();
    branchStore = new InMemoryBranchStore();
    projectService = new ProjectService(generator, projectStore, branchStore);
  });

  describe('createProject', () => {
    it('creates a new project', async () => {
      const created = await projectService.createProject({
        name: 'My project',
        defaultBranch: 'main',
      });

      expect(await projectStore.findById('generated-id')).toEqual(created);
    });
  });
});
