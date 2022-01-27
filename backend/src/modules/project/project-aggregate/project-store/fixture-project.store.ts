import projects from '~/fixtures/projects.json';

import { InMemoryProjectStore } from './in-memory-project.store';

export class FixtureProjectStore extends InMemoryProjectStore {
  constructor() {
    super(projects);
  }
}
