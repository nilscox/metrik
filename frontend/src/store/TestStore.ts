import { IProjectDto } from '@dtos/project/IProjectDto';

import { ProjectGateway } from './ProjectGateway';
import { AppSelector, createStore, Dependencies } from './store';
import { Project, setProject } from '~/project/domain/project.slice';

class InMemoryProjectGateway implements ProjectGateway {
  projects = new Map<string, IProjectDto>();

  async fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    return this.projects.get(projectId);
  }
}

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
