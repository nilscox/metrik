import { Database, ProjectTable } from '~/sql/database';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import { MetricConfiguration, MetricConfigurationProps, Project } from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

export class SqlProjectStore implements ProjectStore {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Project | undefined> {
    const props = await this.db
      .selectFrom('project')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (props) {
      return new Project({
        id: props.id,
        name: props.name,
        defaultBranch: props.default_branch,
        metricsConfig: JSON.parse(props.metrics_config).map(
          (props: MetricConfigurationProps) => new MetricConfiguration(props),
        ),
        snapshots: [],
      });
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
    const props = project.getProps();

    const record: ProjectTable = {
      id: props.id,
      name: props.name,
      default_branch: props.defaultBranch,
      metrics_config: JSON.stringify(props.metricsConfig.map((config) => config.getProps())),
    };

    if (await this.exists(project.id)) {
      await this.db.updateTable('project').set(record).execute();
    } else {
      await this.db.insertInto('project').values(record).execute();
    }
  }

  private async exists(projectId: string): Promise<boolean> {
    const { count } = this.db.fn;

    const result = await this.db
      .selectFrom('project')
      .select(count('id').as('count'))
      .where('id', '=', projectId)
      .executeTakeFirstOrThrow();

    return result.count === 1;
  }
}
