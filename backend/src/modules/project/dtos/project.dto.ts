import { Expose } from 'class-transformer';

import { IProjectDto } from '@shared/dtos/project/IProjectDto';
import { Branch } from '~/modules/branch';
import { BranchDto } from '~/modules/branch/dtos/branch.dto';
import { MetricDto } from '~/modules/metric/dtos/metric.dto';

import { Project } from '../domain/project';

export class ProjectDto implements IProjectDto {
  constructor(project: Project, branches: Branch[]) {
    const props = project.props;

    this.id = props.id;
    this.name = props.name.value;
    this.defaultBranch = props.defaultBranch.props.name.value;
    this.metrics = props.metrics.map((metric) => new MetricDto(metric));
    this.branches = branches.map((branch) => new BranchDto(branch));
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  defaultBranch: string;

  @Expose()
  metrics: MetricDto[];

  @Expose()
  branches: BranchDto[];
}
