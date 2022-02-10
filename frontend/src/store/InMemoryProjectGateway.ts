import { ICreateMetricDto } from '@shared/dtos/project/ICreateMetricDto';
import { IMetricDto, IProjectDto } from '@shared/dtos/project/IProjectDto';
import { ISnapshotDto } from '@shared/dtos/project/ISnapshotDto';

import { ProjectGateway } from './ProjectGateway';

export class InMemoryProjectGateway implements ProjectGateway {
  projects = new Map<string, IProjectDto>();
  snapshots: ISnapshotDto[] = [];

  async fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    return this.projects.get(projectId);
  }

  async fetchSnapshots(): Promise<ISnapshotDto[]> {
    return this.snapshots;
  }

  async createMetric(_projectId: string, dto: ICreateMetricDto): Promise<IMetricDto> {
    return {
      id: 'metricId',
      ...dto,
    };
  }
}
