import { InMemoryStore } from '~/utils/in-memory.store';

import { ProjectStore } from '../application/project.store';
import { Project, ProjectProps } from '../domain/project';

export class InMemoryProjectStore extends InMemoryStore<Project> implements ProjectStore {
  constructor(items?: ProjectProps[]) {
    super(Project, items);
  }

  insert = this.save;
}
