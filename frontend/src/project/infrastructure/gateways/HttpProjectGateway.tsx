import { IProjectDto } from '@shared/dtos/project/IProjectDto';
import { ISnapshotDto } from '@shared/dtos/project/ISnapshotDto';
import { HttpPort } from '~/ports/HttpPort';
import { ProjectGateway } from '~/store';

export class HttpProjectGateway implements ProjectGateway {
  constructor(private readonly http: HttpPort) {}

  async fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    const response = await this.http.get<IProjectDto>(`/project/${projectId}`);

    if (response.status === 404) {
      return;
    }

    return response.body;
  }

  async fetchSnapshots(projectId: string): Promise<ISnapshotDto[]> {
    const response = await this.http.get<ISnapshotDto[]>(`/project/${projectId}/metrics-snapshot`);

    return response.body;
  }
}
