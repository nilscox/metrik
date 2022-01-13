import expect from 'expect';

import { Metric, MetricsSnapshot, MetricsSnapshots } from './Metrics';

describe('Metrics', () => {
  it('creates a new set of metrics at a given point in time', () => {
    const date = new Date('2022-02-10');

    const snapshot = new MetricsSnapshot('1', date, [
      new Metric('linter errors', 4),
    ]);

    expect(snapshot).toEqual({
      id: '1',
      date,
      metrics: [{ key: 'linter errors', value: 4 }],
    });
  });

  it('retrieves the last metrics snapshot', () => {
    const date = new Date('2022-02-10');

    const snapshot = new MetricsSnapshot('1', date, [
      new Metric('linter errors', 4),
    ]);

    const snapshots = new MetricsSnapshots([snapshot]);

    expect(snapshots.getLast()).toEqual({
      id: '1',
      date,
      metrics: [{ key: 'linter errors', value: 4 }],
    });
  });

  it('adds a snapshot to a set of snapshots', () => {
    const date = new Date('2022-02-10');
    const snapshots = new MetricsSnapshots([]);

    snapshots.createSnapshot(date, { 'linter errors': 4 });

    expect(snapshots.snapshots).toEqual([
      {
        id: expect.any(String),
        date,
        metrics: [{ key: 'linter errors', value: 4 }],
      },
    ]);
  });
});
