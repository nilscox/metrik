import { AggregateRoot } from '~/ddd/aggregate-root';

import { BranchName } from './branch-name';
import { ProjectName } from './project-name';

export type ProjectProps = {
  id: string;
  name: ProjectName;
  defaultBranch: BranchName;
};

export type CreateProjectProps = {
  id: string;
  name: string;
  defaultBranch?: string;
};

export class Project extends AggregateRoot<ProjectProps> {
  static create(props: CreateProjectProps) {
    return new Project({
      id: props.id,
      name: new ProjectName(props.name),
      defaultBranch: new BranchName(props.defaultBranch ?? 'master'),
    });
  }

  validate(): void {
    this.props.name.validate();
    this.props.defaultBranch.validate();
  }
}
