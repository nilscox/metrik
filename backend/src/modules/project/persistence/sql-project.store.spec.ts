import { Test } from '@nestjs/testing';
import expect from 'expect';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { ConfigPort } from '~/common/config';
import { TestConfigAdapter } from '~/common/config/test-config.adapter';
import { DatabaseService } from '~/common/database';
import { Metric } from '~/modules/metric';

import { ProjectStore, ProjectStoreToken } from '../application/project.store';
import { Project } from '../domain/project';
import { ProjectModule } from '../project.module';

describe('SqlProjectStore', () => {
  let database: DatabaseService;
  let store: ProjectStore;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProjectModule],
    })
      .overrideProvider(ConfigPort)
      .useValue(new TestConfigAdapter({ STORE: 'sql' }))
      .compile();

    database = moduleRef.get(DatabaseService);
    store = moduleRef.get(ProjectStoreToken);
  });

  after(async () => {
    await database?.closeConnection();
  });

  beforeEach(async () => {
    await database.clear();
  });

  const project = Project.create({
    id: 'p1',
    name: 'My project',
    defaultBranch: {
      id: 'b1',
      projectId: 'p1',
      name: 'main',
    },
  });

  project.addMetric(
    Metric.create({
      id: 'm1',
      label: 'metric',
      type: MetricTypeEnum.number,
      projectId: 'p1',
    }),
  );

  it('saves and finds a project', async () => {
    await store.insert(project);

    await expect(await store.findById('p1')).toEqual(project);
  });
});
