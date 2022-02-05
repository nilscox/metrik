import { IProjectDto } from '@dtos/project/IProjectDto';
import { ISnapshotDto } from '@dtos/project/ISnapshotDto';

export interface ProjectGateway {
  fetchProject(projectId: string): Promise<IProjectDto | undefined>;
  fetchSnapshots(projectId: string): Promise<ISnapshotDto[]>;
}
