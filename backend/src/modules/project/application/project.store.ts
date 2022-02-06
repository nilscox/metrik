import { EntityStore } from '~/sql/base-store';

import { Project } from '../domain/project';

export const ProjectStoreToken = Symbol('ProjectStore');

export interface ProjectStore extends EntityStore<Project> {
  insert(project: Project): Promise<void>;
}
