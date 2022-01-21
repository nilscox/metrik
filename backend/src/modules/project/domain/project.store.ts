import { Project } from './project';

export const ProjectStoreToken = Symbol('ProjectStore');

export interface ProjectStore {
  save(project: Project): Promise<void>;
}
