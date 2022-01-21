import db from '~/sql/database';

import { Project } from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

export class SqlProjectStore implements ProjectStore {
  async save(project: Project): Promise<void> {
    const props = project.getProps();

    await db
      .insertInto('project')
      .values({
        id: props.id,
        name: props.name,
        default_branch: props.defaultBranch,
      })
      .execute();
  }
}
