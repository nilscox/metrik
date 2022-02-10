import { ICreateMetricDto } from '@shared/dtos/project/ICreateMetricDto';
import { IMetricDto, IProjectDto } from '@shared/dtos/project/IProjectDto';
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

  async fetchSnapshots(projectId: string, branch?: string): Promise<ISnapshotDto[]> {
    const query = branch ? `?branch=${branch}` : '';
    const response = await this.http.get<ISnapshotDto[]>(`/project/${projectId}/metrics-snapshot${query}`);

    return response.body;
  }

  async createMetric(projectId: string, dto: ICreateMetricDto): Promise<IMetricDto> {
    const response = await this.http.post<IMetricDto, ICreateMetricDto>(`/project/${projectId}/metric`, dto);

    return response.body;
  }
}
