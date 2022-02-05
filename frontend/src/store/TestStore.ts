import { IProjectDto } from '@dtos/project/IProjectDto';
import { ISnapshotDto } from '@dtos/project/ISnapshotDto';

import { setProject } from '~/project/domain/project.actions';
import { Project } from '~/project/domain/types/Project';

import { ProjectGateway } from './ProjectGateway';
import { AppSelector, createStore, Dependencies } from './store';

class InMemoryProjectGateway implements ProjectGateway {
  projects = new Map<string, IProjectDto>();
  snapshots: ISnapshotDto[] = [];

  async fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    return this.projects.get(projectId);
  }

  async fetchSnapshots(): Promise<ISnapshotDto[]> {
    return this.snapshots;
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
