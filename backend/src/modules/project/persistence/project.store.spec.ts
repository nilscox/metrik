import { Test } from '@nestjs/testing';
import expect from 'expect';

import { DatabaseService, DatabaseToken } from '~/common/database';
import { DevNullLogger, Logger } from '~/common/logger';
import { Database, ProjectTable } from '~/sql/database';

import { Project } from '../domain/project';
import { ProjectModule } from '../project.module';

import { ProjectStore } from './project.store';

describe('ProjectStore', () => {
  let store: ProjectStore;
  let db: Database;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProjectModule],
    })
      .overrideProvider(Logger)
      .useClass(DevNullLogger)
      .compile();

    store = moduleRef.get(ProjectStore);
    db = moduleRef.get(DatabaseToken);

    await moduleRef.get(DatabaseService).runMigrations();
  });

  const createRecord = (overrides: Partial<ProjectTable> = {}): ProjectTable => ({
    id: '1',
    name: 'name',
    default_branch: 'branch',
    ...overrides,
  });

  const insert = async (record: ProjectTable) => {
    await db.insertInto('project').values(record).execute();
  };

  const findOne = async (id: string) => {
    return db.selectFrom('project').selectAll().where('id', '=', id).executeTakeFirst();
  };

  const findAll = async (...ids: string[]) => {
    return db.selectFrom('project').selectAll().where('id', 'in', ids).execute();
  };

  const project1 = Project.create({
    id: '1',
    name: 'My project 1',
    defaultBranch: 'master',
  });

  const record1 = createRecord({
    id: '1',
    name: 'My project 1',
    default_branch: 'master',
  });

  const project2 = Project.create({
    id: '2',
    name: 'My project 2',
    defaultBranch: 'develop',
  });

  const record2 = createRecord({
    id: '2',
    name: 'My project 2',
    default_branch: 'develop',
  });

  describe('findById', () => {
    it('finds a project', async () => {
      await insert(record1);

      await expect(await store.findById('1')).toEqual(project1);
    });

    it('returns undefined when the project id does not exist', async () => {
      expect(await store.findById('nope')).toBeUndefined();
    });
  });

  describe('save', () => {
    it('creates a new project', async () => {
      await store.save(project1);

      expect(await findOne('1')).toEqual(record1);
    });

    it('creates multiple projects', async () => {
      await store.save([project1, project2]);

      expect(await findAll('1', '2')).toEqual([record1, record2]);
    });

    it('updates an existing project', async () => {
      await insert({ ...record1, name: 'Another project' });

      await store.save(project1);

      expect(await findOne('1')).toEqual(record1);
    });

    it('updates multiple existing projects', async () => {
      await insert({ ...record1, name: 'Another project' });
      await insert({ ...record2, default_branch: 'master' });

      await store.save([project1, project2]);

      expect(await findAll('1', '2')).toEqual([record1, record2]);
    });

    it('creates a new project and updates the existing one', async () => {
      await insert({ ...record1, name: 'Another project' });

      await store.save([project1, project2]);

      expect(await findAll('1', '2')).toEqual([record1, record2]);
    });
  });
});
