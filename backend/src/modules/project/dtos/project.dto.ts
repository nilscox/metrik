import { Expose } from 'class-transformer';

import { IProjectDto } from '@shared/dtos/project/IProjectDto';
import { MetricDto } from '~/modules/metric/dtos/metric.dto';

import { Project } from '../domain/project';

export class ProjectDto implements IProjectDto {
  constructor(project: Project) {
    const props = project.props;

    this.id = props.id;
    this.name = props.name.value;
    this.defaultBranch = props.defaultBranch.value;
    this.metrics = props.metrics.map((metric) => new MetricDto(metric));
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  defaultBranch: string;

  @Expose()
  metrics: MetricDto[];
}
