import { Expose } from 'class-transformer';

import { IBranchDto } from '@shared/dtos/project/IProjectDto';
import { Branch } from '~/modules/branch';

export class BranchDto implements IBranchDto {
  constructor(metric: Branch) {
    this.id = metric.props.id;
    this.name = metric.props.name.value;
  }

  @Expose()
  id: string;

  @Expose()
  name: string;
}
