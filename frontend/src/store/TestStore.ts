import { setProject } from '~/project/domain/project.actions';
import { Project } from '~/project/domain/types/Project';

import { InMemoryProjectGateway } from './InMemoryProjectGateway';
import { AppSelector, createStore, Dependencies } from './store';

interface TestDependencies extends Dependencies {
  projectGateway: InMemoryProjectGateway;
}

export class TestStore implements TestDependencies {
  projectGateway = new InMemoryProjectGateway();

  private reduxStore = createStore(this);

  getState = this.reduxStore.getState;
  dispatch = this.reduxStore.dispatch;
  subscribe = this.reduxStore.subscribe;

  select<Result, Params extends unknown[]>(selector: AppSelector<Result, Params>, ...params: Params): Result {
    return selector(this.getState(), ...params);
  }

  set project(project: Project) {
    this.dispatch(setProject(project));
  }
}
