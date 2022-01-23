import { IProjectDto } from '../../../dtos/project/IProjectDto';

export interface ProjectGateway {
  fetchProject(projectId: string): Promise<IProjectDto>;
}
