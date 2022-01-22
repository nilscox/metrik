import { Test } from '@nestjs/testing';
import expect from 'expect';

import { DatabaseService, DatabaseToken } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { Database } from '~/sql/database';

import { createMetricsConfiguration, createProject, Project } from '../../domain/project';
import { ProjectModule } from '../project.module';

import { SqlProjectStore } from './sql-project.store';

describe('SqlProjectStore', () => {
  let database: DatabaseService;
  let db: Database;
  let store: SqlProjectStore;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProjectModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    database = moduleRef.get(DatabaseService);
    db = moduleRef.get<Database>(DatabaseToken);
    store = new SqlProjectStore(db);

    await database.runMigrations();
  });

  after(async () => {
    await database.closeConnection();
  });

  beforeEach(async () => {
    await database.clear();
  });

  const save = async (project: Project) => {
    await store.save(project);
    return project;
  };

  const find = async (projectId: string) => {
    return store.findById(projectId);
  };

  it('finds a project from its id', async () => {
    const projectId = 'projectId';
    const project = await save(createProject({ id: projectId }));

    const foundProject = await store.findById(projectId);

    expect(foundProject).toEqual(project);
  });

  it('saves a new project', async () => {
    const project = createProject({ metricsConfig: [createMetricsConfiguration()] });

    await store.save(project);

    expect(await find(project.id)).toEqual(project);
  });

  it('updates an existing project', async () => {
    const project = await save(createProject({ metricsConfig: [createMetricsConfiguration()] }));

    // @ts-expect-error see SqlUserStore#save spec
    project.props.name = 'updated';

    await store.save(project);

    expect(await find(project.id)).toHaveProperty('props.name', 'updated');
  });
});
