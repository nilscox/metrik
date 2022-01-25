import expect from 'expect';

import { TestStore } from '~/store/TestStore';

import { createMetricsSnapshot } from '../../types/MetricsSnapshot';
import { createProject } from '../../types/Project';

import { selectLastSnapshot, selectSnapshots } from './selectSnapshots';

describe('selectSnapshots', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  const snapshot = createMetricsSnapshot({
    date: '2022-02-10',
    metrics: [],
  });

  const project = createProject({
    id: 'project-id',
    snapshots: [snapshot],
  });

  describe('selectSnapshots', () => {
    it("selects a project's snapshots", () => {
      store.project = project;

      expect(store.select(selectSnapshots, 'project-id')).toEqual([
        {
          date: new Date('2022-02-10'),
          metrics: [],
        },
      ]);
    });
  });

  describe('selectLastSnapshot', () => {
    it("selects a project's last snapshot", () => {
      store.project = project;

      expect(store.select(selectLastSnapshot, 'project-id')).toEqual({
        date: new Date('2022-02-10'),
        metrics: [],
      });
    });

    it('returns undefined when the project has no snapshot', () => {
      store.project = createProject({
        id: 'project-id',
        snapshots: [],
      });

      expect(store.select(selectLastSnapshot, 'project-id')).toBeUndefined();
    });
  });
});
