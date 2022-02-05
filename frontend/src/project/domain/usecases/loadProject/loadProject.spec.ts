import expect from 'expect';

import { TestStore } from '~/store';

import { selectLoadingProjects, selectProject } from '../../project.selectors';

import { loadProject } from './loadProject';

describe('loadProjects', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  const projectId = 'project-id';

  const snapshotId = 'snapshot-id';
  const snapshotDate = new Date('2022-01-01').toISOString();

  it('loads a project', async () => {
    store.projectGateway.projects.set(projectId, {
      id: projectId,
      name: 'My project',
      defaultBranch: 'master',
      metrics: [],
    });

    store.projectGateway.snapshots.push({
      id: snapshotId,
      date: snapshotDate,
      metrics: [],
    });

    const promise = store.dispatch(loadProject(projectId));

    expect(store.select(selectLoadingProjects)).toBe(true);

    await promise;

    expect(store.select(selectLoadingProjects)).toBe(false);

    expect(store.select(selectProject, projectId)).toEqual({
      id: projectId,
      name: 'My project',
      defaultBranch: 'master',
      metrics: [],
      snapshots: [
        {
          id: snapshotId,
          date: snapshotDate,
          metrics: [],
        },
      ],
    });
  });
});
