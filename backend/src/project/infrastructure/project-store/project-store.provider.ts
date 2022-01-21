import { FactoryProvider } from '@nestjs/common';

import { ConfigPort } from '~/common/config';

import { ProjectStore, ProjectStoreToken } from '../../domain/project.store';

import { FixtureProjectStore } from './fixture-project.store';
import { InMemoryProjectStore } from './in-memory-project.store';
import { SqlProjectStore } from './sql-project.store';

export const projectStoreProvider: FactoryProvider<ProjectStore> = {
  provide: ProjectStoreToken,
  inject: [ConfigPort],
  useFactory: (config: ConfigPort) => {
    const store = config.get('STORE');

    switch (store) {
      case 'memory':
        return new InMemoryProjectStore();

      case 'fixture':
        return new FixtureProjectStore();

      case 'sql':
        return new SqlProjectStore();

      default:
        throw new Error(`invalid STORE value '${store}'`);
    }
  },
};
