import { Database, ProjectTable } from '~/sql/database';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import {
  Metric,
  MetricConfiguration,
  MetricConfigurationProps,
  MetricsSnapshot,
  Project,
} from '../../domain/project';
import { ProjectStore } from '../../domain/project.store';

export class SqlProjectStore implements ProjectStore {
  constructor(private readonly db: Database) {}

  async findById(projectId: string): Promise<Project | undefined> {
    const props = await this.db
      .selectFrom('project')
      .selectAll()
      .where('project.id', '=', projectId)
      .executeTakeFirst();

    if (props) {
      return new Project({
        id: props.id,
        name: props.name,
        defaultBranch: props.default_branch,
        metricsConfig: JSON.parse(props.metrics_config).map(
          (props: MetricConfigurationProps) => new MetricConfiguration(props),
        ),
        snapshots: await this.findProjectMetrics(projectId),
      });
    }
  }

  private async findProjectMetrics(projectId: string): Promise<MetricsSnapshot[]> {
    const props = await this.db
      .selectFrom('snapshot')
      .selectAll()
      .where('project_id', '=', projectId)
      .execute();

    return Promise.all(
      props.map(
        async (record) =>
          new MetricsSnapshot({
            id: record.id,
            date: new Date(record.date),
            metrics: await this.findSnapshotMetrics(record.id),
          }),
      ),
    );
  }

  private async findSnapshotMetrics(snapshotId: string): Promise<Metric[]> {
    const props = await this.db
      .selectFrom('metric')
      .selectAll()
      .where('snapshot_id', '=', snapshotId)
      .execute();

    return props.map((record) => ({
      label: record.label,
      value: record.value,
    }));
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

    const snapshotsIdsResult = await this.db
      .selectFrom('snapshot')
      .select('id')
      .where('project_id', '=', project.id)
      .execute();
    const snapshotsIds = snapshotsIdsResult.map(({ id }) => id);

    // todo: remove explicit typing
    const snapshotsToCreate: MetricsSnapshot[] = props.snapshots.filter(
      ({ id }) => !snapshotsIds.includes(id),
    );

    for (const snapshot of snapshotsToCreate) {
      const props = snapshot.getProps();

      await this.db
        .insertInto('snapshot')
        .values({
          id: props.id,
          date: props.date.toISOString(),
          project_id: project.id,
        })
        .execute();

      for (const metric of props.metrics) {
        await this.db
          .insertInto('metric')
          .values({
            label: metric.label,
            value: metric.value,
            snapshot_id: snapshot.id,
          })
          .execute();
      }
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
