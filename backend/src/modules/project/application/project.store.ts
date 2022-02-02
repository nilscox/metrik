import { EntityStore } from '~/sql/base-store';

import { Project } from '../domain/project';

export const ProjectStoreToken = Symbol('ProjectStore');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectStore extends EntityStore<Project> {}
