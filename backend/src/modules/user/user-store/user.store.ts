import { EntityStore } from '~/sql/base-store';

import { User } from '../domain/user';

export const UserStoreToken = Symbol('UserStoreToken');

export interface UserStore extends EntityStore<User> {
  findByEmail(email: string): Promise<User | undefined>;
  findByToken(token: string): Promise<User | undefined>;
}
