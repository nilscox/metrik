import expect from 'expect';

import { BranchStore, InMemoryBranchStore } from '~/modules/branch';

import { InMemoryProjectStore } from '../persistence/in-memory-project.store';

import { ProjectService } from './project.service';
import { ProjectStore } from './project.store';

describe('ProjectService', () => {
  let projectStore: ProjectStore;
  let branchStore: BranchStore;
  let projectService: ProjectService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    branchStore = new InMemoryBranchStore();
    projectService = new ProjectService(projectStore, branchStore);
  });

  describe('createProject', () => {
    it('creates a new project', async () => {
      // todo: make this a command
      const created = await projectService.createProject({
        id: 'p1',
        name: 'My project',
        defaultBranch: { id: 'b1', projectId: 'p1', name: 'main' },
      });

      expect(await projectStore.findById('p1')).toEqual(created);
    });
  });
});
