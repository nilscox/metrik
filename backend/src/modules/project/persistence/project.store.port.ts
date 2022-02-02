import { Project } from '../domain/project';

export interface ProjectStorePort {
  findByIdOrFail(id: string): Promise<Project>;
  save(project: Project): Promise<void>;
}
