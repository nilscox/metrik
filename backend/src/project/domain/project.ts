import { Entity } from '../../ddd/entity';

export type ProjectProps = {
  id: string;
  name: string;
  defaultBranch: string;
};

export class Project extends Entity {
  constructor(private props: ProjectProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  getProps() {
    return this.props;
  }
}

export const createProject = (
  overrides: Partial<ProjectProps> = {},
): Project => {
  return new Project({
    id: '1',
    name: 'name',
    defaultBranch: 'defaultBranch',
    ...overrides,
  });
};
