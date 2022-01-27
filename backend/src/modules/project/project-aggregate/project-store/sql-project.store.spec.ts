import { Test } from '@nestjs/testing';
import expect from 'expect';

import { DatabaseService, DatabaseToken } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { Database } from '~/sql/database';

import {
  createMetric,
  createMetricsConfiguration,
  createMetricsSnapshot,
  createProject,
  Project,
} from '../../domain/project';
import { ProjectAggregateModule } from '../index';

import { SqlProjectStore } from './sql-project.store';

describe('SqlProjectStore', () => {
  let database: DatabaseService;
  let db: Database;
  let store: SqlProjectStore;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProjectAggregateModule],
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

  const metricsConfiguration = createMetricsConfiguration({
    label: 'metric',
    type: 'number',
    unit: 'number',
  });

  const metric1 = createMetric({
    label: 'metric 1',
    value: 1,
  });

  const metric2 = createMetric({
    label: 'metric 2',
    value: 2,
  });

  const metric3 = createMetric({
    label: 'metric 3',
    value: 3,
  });

  const snapshot1 = createMetricsSnapshot({
    id: '1',
    reference: 'snapshot-1',
    date: new Date('2022-01-01'),
    metrics: [metric1, metric2],
  });

  const snapshot2 = createMetricsSnapshot({
    id: '2',
    date: new Date('2022-01-02'),
    metrics: [metric3],
  });

  const projectId = 'projectId';
  const project = createProject({
    id: projectId,
    metricsConfig: [metricsConfiguration],
    snapshots: [snapshot1, snapshot2],
  });

  it('finds a project from its id', async () => {
    await save(project);

    const foundProject = await store.findById(projectId);

    expect(foundProject).toEqual(project);
  });

  it('does not find a project from an id', async () => {
    expect(await store.findById(projectId)).toBeUndefined();
  });

  it('saves a new empty project', async () => {
    const project = createProject({ id: projectId, metricsConfig: [], snapshots: [] });

    await store.save(project);

    expect(await find(projectId)).toEqual(project);
  });

  it('saves a new project with configs and an empty snapshot', async () => {
    const project = createProject({
      id: projectId,
      metricsConfig: [metricsConfiguration],
      snapshots: [createMetricsSnapshot({ metrics: [] })],
    });

    await store.save(project);

    expect(await find(project.id)).toEqual(project);
  });

  it('saves a new project with configs, snapshots and metrics', async () => {
    await store.save(project);

    expect(await find(project.id)).toEqual(project);
  });

  it('updates an existing project', async () => {
    const project = await save(
      createProject({
        id: projectId,
        metricsConfig: [createMetricsConfiguration()],
      }),
    );

    // @ts-expect-error see SqlUserStore#save spec
    project.props.name = 'updated';

    await store.save(project);

    expect(await find(projectId)).toHaveProperty('props.name', 'updated');
  });

  it.skip("updates an existing project's metric", async () => {
    await save(project);

    // @ts-expect-error see SqlUserStore#save spec
    project.props.snapshots[0].props.metrics[0].value = 6;

    await store.save(project);
    console.dir(await find(projectId), { depth: null });

    expect(await find(projectId)).toHaveProperty('props.snapshots[0].props.metrics[0].value', 6);
  });
});
