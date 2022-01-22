import expect from 'expect';

import { StubDateAdapter } from '~/common/date/stub-date.adapter';
import { StubGeneratorAdapter } from '~/common/generator';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import { InMemoryProjectStore } from '../infrastructure/project-store/in-memory-project.store';

import { DuplicatedMetricError } from './duplicated-metric.error';
import { InvalidMetricValueTypeError } from './invalid-metric-value-type.error';
import { MetricConfigurationLabelAlreadyExistsError } from './metric-configuration-label-already-exists.error';
import {
  createMetricsConfiguration,
  createProject,
  MetricConfiguration,
  MetricsSnapshot,
  Project,
  ProjectProps,
} from './project';
import { ProjectService } from './project.service';
import { UnknownMetricLabelError } from './unknown-metric-label.error';

describe('ProjectService', () => {
  let projectStore: InMemoryProjectStore;
  let generator: StubGeneratorAdapter;
  let date: StubDateAdapter;
  let service: ProjectService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    generator = new StubGeneratorAdapter();
    date = new StubDateAdapter();
    service = new ProjectService(projectStore, generator, date);
  });

  const save = async (project: Project) => {
    await projectStore.save(project);
    return project;
  };

  const find = async (id: string) => {
    return projectStore.findByIdOrFail(id);
  };

  it('creates a new project', async () => {
    const createdProject = await service.createNewProject('project name', 'master');

    const expected: ProjectProps = {
      id: 'generated-id',
      name: 'project name',
      defaultBranch: 'master',
      metricsConfig: [],
      snapshots: [],
    };

    expect(createdProject.getProps()).toEqual(expected);

    const savedProject = await find(createdProject.id);
    expect(savedProject?.getProps()).toEqual(expected);
  });

  it('adds a metric configuration to a project', async () => {
    const project = await save(createProject());

    await service.addMetricConfiguration(project.id, 'Linter warnings', 'number', 'integer');

    const savedProject = await find(project.id);
    expect(savedProject?.getProps().metricsConfig).toEqual([
      new MetricConfiguration({ label: 'Linter warnings', unit: 'number', type: 'integer' }),
    ]);
  });

  it('fails when the project id does not exist', async () => {
    const project = createProject();

    await expect(
      service.addMetricConfiguration(project.id, 'Linter warnings', 'number', 'integer'),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('prevents to add a metric configuration when its label already exists', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'existing' })];
    const project = await save(createProject({ metricsConfig }));

    await expect(
      service.addMetricConfiguration(project.id, 'existing', 'number', 'number'),
    ).rejects.toThrow(MetricConfigurationLabelAlreadyExistsError);
  });

  it("creates a new snapshot of the project's metrics", async () => {
    const now = new Date('2022-01-01');
    date.now = now;

    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [{ label: 'Lines of code', value: 1234 }];

    await service.createMetricsSnapshot(project.id, metrics);

    const savedProject = await find(project.id);
    expect(savedProject.getProps().snapshots).toEqual([
      new MetricsSnapshot({
        date: now,
        metrics,
      }),
    ]);
  });

  it('fails when the project id does not exist', async () => {
    const project = createProject();

    await expect(service.createMetricsSnapshot(project.id, [])).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  it('prevents to create a snapshot with an unknown metric label', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [{ label: 'Line of code', value: 4321 }];

    await expect(service.createMetricsSnapshot(project.id, metrics)).rejects.toThrow(
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

    await expect(service.createMetricsSnapshot(project.id, metrics)).rejects.toThrow(
      DuplicatedMetricError,
    );
  });

  it('prevents to create a snapshot with an invalid metric value type', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'Lines of code', type: 'integer' })];
    const project = await save(createProject({ metricsConfig }));

    const metrics = [{ label: 'Lines of code', value: 12.34 }];

    await expect(service.createMetricsSnapshot(project.id, metrics)).rejects.toThrow(
      InvalidMetricValueTypeError,
    );
  });
});
