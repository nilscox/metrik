import { EntityStore } from '~/sql/base-store';

import { Branch } from '../domain/branch';

export const BranchStoreToken = Symbol('BranchStoreToken');

export interface BranchStore extends EntityStore<Branch> {
  findByName(projectId: string, name: string): Promise<Branch | undefined>;
  findAllForProjectId(projectId: string): Promise<Branch[]>;
}
