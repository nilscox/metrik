import expect from 'expect';

import { StubFileSystemAdapter } from '../../../file-system/stub-file-system.adapter';

import { FsMetricsStore } from './fs-metrics.store';

describe('FsMetricsStore', () => {
  it('retrieves the list of snapshots', async () => {
    const date = new Date('2022-08-07');
    const fs = new StubFileSystemAdapter();

    fs.files.set('db.json', [
      {
        date: date.toISOString(),
        metrics: [{ key: 'linter errors', value: 4 }],
      },
    ]);

    const store = new FsMetricsStore(fs);

    expect(await store.getSnapshots()).toEqual({
      snapshots: [
        {
          date,
          metrics: [{ key: 'linter errors', value: 4 }],
        },
      ],
    });
  });

  it('creates an empty data store file if it does not exist', async () => {
    const fs = new StubFileSystemAdapter();
    const store = new FsMetricsStore(fs);

    expect(await store.getSnapshots()).toEqual({
      snapshots: [],
    });

    expect(fs.files.get('db.json')).toEqual({
      snapshots: [],
    });
  });
});
