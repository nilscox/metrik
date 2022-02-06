import { InMemoryStore } from '~/utils/in-memory.store';

import { User, UserProps } from '../domain/user';

import { UserStore } from './user.store';

export class InMemoryUserStore extends InMemoryStore<User> implements UserStore {
  constructor(items?: UserProps[]) {
    super(User, items);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find(({ props }) => props.email === email);
  }

  async findByToken(token: string): Promise<User | undefined> {
    return this.find(({ props }) => props.token === token);
  }
}
