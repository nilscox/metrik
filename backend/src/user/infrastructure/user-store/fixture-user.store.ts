import users from '../../../fixtures/users.json';

import { InMemoryUserStore } from './in-memory-user.store';

export class FixtureUserStore extends InMemoryUserStore {
  constructor() {
    super(users);
  }
}
