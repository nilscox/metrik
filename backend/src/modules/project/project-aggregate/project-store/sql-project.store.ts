import { Database, MetricsSnapshotTable, MetricTable, ProjectTable } from '~/sql/database';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';
import { partition } from '~/utils/partition';

import {
  Metric,
  MetricConfiguration,
  MetricConfigurationProps,
  MetricsSnapshot,
  Project,
} from '../../domain/project';

import { ProjectStore } from './project.store';

type FindResult = {
  project_id: string;
  project_name: string;
  project_default_branch: string;
  project_metrics_config: string;
  snapshot_id: string | null;
  snapshot_reference: string | null;
  snapshot_date: string | null;
  metric_id: string | null;
  metric_label: string | null;
  metric_value: number | null;
};

export class SqlProjectStore implements ProjectStore {
  constructor(private readonly db: Database) {}

  async findById(projectId: string): Promise<Project | undefined> {
    const result = await this.db
      .selectFrom('project')
      .leftJoin('snapshot', 'snapshot.project_id', 'project.id')
      .leftJoin('metric', 'metric.snapshot_id', 'snapshot.id')
      .select([
        'project.id as project_id',
        'project.name as project_name',
        'project.default_branch as project_default_branch',
        'project.metrics_config as project_metrics_config',
        'snapshot.id as snapshot_id',
        'snapshot.reference as snapshot_reference',
        'snapshot.date as snapshot_date',
        'metric.id as metric_id',
        'metric.label as metric_label',
        'metric.value as metric_value',
      ])
      .where('project.id', '=', projectId)
      .execute();

    if (!result.length) {
      return;
    }

    return this.createProjectFromRecords(result);
  }

  private createProjectFromRecords(records: FindResult[]) {
    const record = records[0];
    const snapshots = Object.values(partition('snapshot_id', records)).filter(
      ([{ snapshot_id }]) => snapshot_id !== null,
    );

    return new Project({
      id: record.project_id,
      name: record.project_name,
      defaultBranch: record.project_default_branch,
      metricsConfig: JSON.parse(record.project_metrics_config).map(
        (config: MetricConfigurationProps) => new MetricConfiguration(config),
      ),
      snapshots: snapshots.map(this.createSnapshotFromRecords.bind(this)),
    });
  }

  private createSnapshotFromRecords(records: FindResult[]): MetricsSnapshot {
    const record = records[0];
    const metrics = Object.values(partition('metric_id', records)).filter(
      ([{ metric_id }]) => metric_id !== null,
    );

    return new MetricsSnapshot({
      id: record.snapshot_id as string,
      reference: record.snapshot_reference ?? undefined,
      date: new Date(record.snapshot_date as string),
      metrics: Object.values(metrics).flatMap(this.createMetricsFromRecords.bind(this)),
    });
  }

  private createMetricsFromRecords(record: FindResult[]): Metric[] {
    return record.map((record) => ({
      label: record.metric_label as string,
      value: record.metric_value as number,
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

    const existingSnapshotsIdsResult = await this.db
      .selectFrom('snapshot')
      .select('id')
      .where('project_id', '=', project.id)
      .execute();

    const existingSnapshotsIds = existingSnapshotsIdsResult.map(({ id }) => id);
    const snapshotsToCreate = props.snapshots.filter(
      ({ id }) => !existingSnapshotsIds.includes(id),
    );

    if (snapshotsToCreate.length === 0) {
      return;
    }

    const snapshotsToInsert: MetricsSnapshotTable[] = snapshotsToCreate
      .map((snapshot) => snapshot.getProps())
      .map((props) => ({
        id: props.id,
        reference: props.reference ?? null,
        date: props.date.toISOString(),
        project_id: project.id,
      }));

    await this.db.insertInto('snapshot').values(snapshotsToInsert).execute();

    const metricsToInsert: Omit<MetricTable, 'id'>[] = snapshotsToCreate
      .map((snapshot) => snapshot.getProps())
      .flatMap(({ id, metrics }) =>
        metrics.map((metric) => ({
          label: metric.label,
          value: metric.value,
          snapshot_id: id,
        })),
      );

    if (metricsToInsert.length > 0) {
      await this.db.insertInto('metric').values(metricsToInsert).execute();
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
