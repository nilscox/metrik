import { EntityNotFoundError } from '~/utils/entity-not-found.error';
import { InMemoryStore } from '~/utils/in-memory.store';

import { MetricConfiguration, Project } from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

type ProjectStoreProps = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: Array<{
    label: string;
    unit: string;
    type: string;
  }>;
};

export class InMemoryProjectStore extends InMemoryStore<ProjectStoreProps> implements ProjectStore {
  async findById(id: string): Promise<Project | undefined> {
    const props = this.get(id);

    if (props) {
      return this.toEntity(props);
    }
  }

  async findByIdOrFail(id: string): Promise<Project> {
    const project = await this.findById(id);

    if (!project) {
      throw new EntityNotFoundError('Project', { id });
    }

    return project;
  }

  async save(project: Project): Promise<void> {
    this.add(this.toStoreProps(project));
  }

  private toStoreProps(project: Project): ProjectStoreProps {
    const props = project.getProps();

    return {
      ...props,
      metricsConfig: props.metricsConfig.map((config) => config.getProps()),
    };
  }

  private toEntity(props: ProjectStoreProps) {
    return new Project({
      ...props,
      metricsConfig: props.metricsConfig.map((config) => new MetricConfiguration(config)),
    });
  }
}
