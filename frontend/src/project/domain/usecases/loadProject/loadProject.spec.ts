import expect from 'expect';

import { TestStore } from '~/store/TestStore';

import { selectLoadingProjects, selectProject } from '../../project.slice';

import { loadProject } from './loadProject';

describe('loadProjects', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  const projectId = 'project-id';

  it('loads a project', async () => {
    store.projectGateway.projects.set(projectId, {
      id: projectId,
      name: 'My project',
      defaultBranch: 'master',
      metricsConfig: [],
      snapshots: [],
    });

    const promise = store.dispatch(loadProject(projectId));

    expect(store.select(selectLoadingProjects)).toBe(true);

    await promise;

    expect(store.select(selectLoadingProjects)).toBe(false);

    expect(store.select(selectProject, projectId)).toEqual({
      id: projectId,
      name: 'My project',
      defaultBranch: 'master',
      metricsConfig: [],
      snapshots: [],
    });
  });
});
