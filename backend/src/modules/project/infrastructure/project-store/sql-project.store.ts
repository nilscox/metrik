import { Database } from '~/sql/database';

import { Project } from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

export class SqlProjectStore implements ProjectStore {
  constructor(private readonly db: Database) {}

  async save(project: Project): Promise<void> {
    const props = project.getProps();

    await this.db
      .insertInto('project')
      .values({
        id: props.id,
        name: props.name,
        default_branch: props.defaultBranch,
      })
      .execute();
  }
}
