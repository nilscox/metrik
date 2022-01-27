import expect from 'expect';

import { StubDateAdapter } from '~/common/date/stub-date.adapter';
import { StubGeneratorAdapter } from '~/common/generator';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import {
  DuplicatedMetricError,
  InvalidMetricValueTypeError,
  UnknownMetricLabelError,
} from '../../../domain';
import {
  createMetricsConfiguration,
  createProject,
  MetricsSnapshot,
  Project,
} from '../../../domain/project';
import { InMemoryProjectStore } from '../../../project-aggregate';

import { MetricsSnapshotService } from './metrics-snapshot.service';

describe('MetricsSnapshotService', () => {
  let projectStore: InMemoryProjectStore;
  let generator: StubGeneratorAdapter;
  let date: StubDateAdapter;
  let service: MetricsSnapshotService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    generator = new StubGeneratorAdapter();
    date = new StubDateAdapter();
    service = new MetricsSnapshotService(projectStore, generator, date);
  });

  const save = async (project: Project) => {
    await projectStore.save(project);
    return project;
  };

  const find = async (id: string) => {
    return projectStore.findByIdOrFail(id);
  };

  it("creates a new snapshot of the project's metrics", async () => {
    const now = new Date('2022-01-01');
    date.now = now;

    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code' })];
    const project = await save(createProject({ metricsConfig }));
    const reference = 'ref';

    const metrics = [{ label: 'Lines of code', value: 1234 }];

    await service.createMetricsSnapshot(project.id, reference, metrics);

    const savedProject = await find(project.id);
    expect(savedProject.getProps().snapshots).toEqual([
      new MetricsSnapshot({
        id: 'generated-id',
        reference,
        date: now,
        metrics,
      }),
    ]);
  });

  it('fails when the project id does not exist', async () => {
    const project = createProject();

    await expect(service.createMetricsSnapshot(project.id, undefined, [])).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  it('prevents to create a snapshot with an unknown metric label', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [{ label: 'Line of code', value: 4321 }];

    await expect(service.createMetricsSnapshot(project.id, undefined, metrics)).rejects.toThrow(
      UnknownMetricLabelError,
    );
  });

  it('prevents to create a snapshot with the same metric label twice', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code', type: 'integer' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [
      { label: 'Lines of code', value: 1234 },
      { label: 'Lines of code', value: 5678 },
    ];

    await expect(service.createMetricsSnapshot(project.id, undefined, metrics)).rejects.toThrow(
      DuplicatedMetricError,
    );
  });

  it('prevents to create a snapshot with an invalid metric value type', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code', type: 'integer' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [{ label: 'Lines of code', value: 12.34 }];

    await expect(service.createMetricsSnapshot(project.id, undefined, metrics)).rejects.toThrow(
      InvalidMetricValueTypeError,
    );
  });
});
