import { Inject, Injectable } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { BaseStore } from '~/sql/base-store';
import { Database } from '~/sql/database';
import { EntityMapper } from '~/sql/entity-mapper';
import { logSqlQuery } from '~/utils/logSqlQuery';

import { BranchName } from '../domain/branch-name';
import { Project, ProjectProps } from '../domain/project';
import { ProjectName } from '../domain/project-name';

import { ProjectStorePort } from './project.store.port';

logSqlQuery;

type ProjectRecord = {
  project_id: string;
  project_name: string;
  project_default_branch: string;
};

class ProjectEntityMapper extends EntityMapper<Project, ProjectRecord> {
  constructor() {
    super(Project, 'project_id');
  }

  toEntityProps(records: ProjectRecord[]): ProjectProps {
    const record = records[0];

    return {
      id: record.project_id,
      name: new ProjectName(record.project_name),
      defaultBranch: new BranchName(record.project_default_branch),
    };
  }

  propsToRecords(props: ProjectProps) {
    return {
      project: [
        {
          id: props.id,
          name: props.name.value,
          default_branch: props.defaultBranch.value,
        },
      ],
    };
  }
}

@Injectable()
export class ProjectStore extends BaseStore<Project, ProjectRecord> implements ProjectStorePort {
  constructor(@Inject(DatabaseToken) db: Database) {
    super(db, 'project', new ProjectEntityMapper());
  }

  async findOne(id: string): Promise<ProjectRecord[]> {
    return this.db
      .selectFrom('project')
      .select([
        'project.id as project_id',
        'project.name as project_name',
        'project.default_branch as project_default_branch',
      ])
      .where('id', '=', id)
      .execute();
  }
}
