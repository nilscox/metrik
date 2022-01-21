import { InMemoryStore } from '~/common/utils/in-memory.store';

import { Project, ProjectProps } from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

export class InMemoryProjectStore extends InMemoryStore<ProjectProps> implements ProjectStore {
  async save(project: Project): Promise<void> {
    this.add(project.getProps());
  }
}
