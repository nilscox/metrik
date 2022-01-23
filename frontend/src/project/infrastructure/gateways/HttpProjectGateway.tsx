import { IProjectDto } from '../../../../../dtos/project/IProjectDto';
import { HttpPort } from '../../../ports/HttpPort';
import { ProjectGateway } from '../../../store/ProjectGateway';

export class HttpProjectGateway implements ProjectGateway {
  constructor(private readonly http: HttpPort) {}

  async fetchProject(projectId: string): Promise<IProjectDto> {
    const response = await this.http.get<IProjectDto>(`/project/${projectId}`);

    return response.body;
  }
}
