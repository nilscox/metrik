import { Test } from '@nestjs/testing';
import expect from 'expect';
import { Connection } from 'typeorm';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { DatabaseService } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { Metric } from '~/modules/metric';

import { ProjectStore, ProjectStoreToken } from '../application/project.store';
import { Project } from '../domain/project';
import { ProjectModule } from '../project.module';

describe('SqlProjectStore', () => {
  let store: ProjectStore;
  let connection: Connection;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProjectModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    store = moduleRef.get(ProjectStoreToken);
    connection = moduleRef.get(Connection);

    await moduleRef.get(DatabaseService).runMigrations();
  });

  afterEach(() => {
    connection?.close();
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
