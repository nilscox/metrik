import { AggregateRoot } from '~/ddd/aggregate-root';

import { BranchName } from './branch-name';

export type BranchProps = {
  id: string;
  projectId: string;
  name: BranchName;
};

export type CreateBranchProps = {
  id: string;
  projectId: string;
  name: string;
};

export class Branch extends AggregateRoot<BranchProps> {
  static create(props: CreateBranchProps) {
    return new Branch({
      id: props.id,
      projectId: props.projectId,
      name: new BranchName(props.name),
    });
  }

  validate(): void {
    this.props.name.validate();
  }
}

export const createBranch = (overrides: Partial<BranchProps> = {}) => {
  return new Branch({
    id: 'branchId',
    name: new BranchName('name'),
    projectId: 'projectId',
    ...overrides,
  });
};
