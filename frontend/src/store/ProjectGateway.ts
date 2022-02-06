import { IProjectDto } from '@shared/dtos/project/IProjectDto';
import { ISnapshotDto } from '@shared/dtos/project/ISnapshotDto';

export interface ProjectGateway {
  fetchProject(projectId: string): Promise<IProjectDto | undefined>;
  fetchSnapshots(projectId: string, branch?: string): Promise<ISnapshotDto[]>;
}
