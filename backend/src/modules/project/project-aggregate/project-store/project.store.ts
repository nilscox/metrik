import { Project } from '../../domain/project';

export const ProjectStoreToken = Symbol('ProjectStore');

export interface ProjectStore {
  findById(id: string): Promise<Project | undefined>;
  findByIdOrFail(id: string): Promise<Project>;
  save(project: Project): Promise<void>;
}
