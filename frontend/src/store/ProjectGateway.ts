import { IProjectDto } from '../../../dtos/project/IProjectDto';

export interface ProjectGateway {
  fetchProjects(): Promise<IProjectDto[]>;
}
