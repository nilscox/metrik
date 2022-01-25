import { IProjectDto } from '@dtos/project/IProjectDto';

import { HttpPort } from '~/ports/HttpPort';
import { ProjectGateway } from '~/store/ProjectGateway';

export class HttpProjectGateway implements ProjectGateway {
  constructor(private readonly http: HttpPort) {}

  async fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    const response = await this.http.get<IProjectDto>(`/project/${projectId}`);

    if (response.status === 404) {
      return;
    }

    return response.body;
  }
}
