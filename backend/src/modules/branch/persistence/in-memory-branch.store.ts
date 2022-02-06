import { InMemoryStore } from '~/utils/in-memory.store';

import { BranchStore } from '../application/branche.store';
import { Branch, BranchProps } from '../domain/branch';

export class InMemoryBranchStore extends InMemoryStore<Branch> implements BranchStore {
  constructor(items?: BranchProps[]) {
    super(Branch, items);
  }

  async findByName(projectId: string, name: string): Promise<Branch | undefined> {
    const projectBranches = await this.findAllForProjectId(projectId);

    return projectBranches.find(({ props }) => props.name.is(name));
  }

  async findAllForProjectId(projectId: string): Promise<Branch[]> {
    return this.filter(({ props }) => props.projectId === projectId);
  }
}
