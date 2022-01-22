import expect from 'expect';

import { StubGeneratorAdapter } from '~/common/generator';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import { InMemoryProjectStore } from '../infrastructure/project-store/in-memory-project.store';

import { MetricConfigurationLabelAlreadyExistsError } from './metric-configuration-label-already-exists.error';
import { createProject, MetricConfiguration, ProjectProps } from './project';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let projectStore: InMemoryProjectStore;
  let generator: StubGeneratorAdapter;
  let service: ProjectService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    generator = new StubGeneratorAdapter();
    service = new ProjectService(projectStore, generator);
  });

  it('creates a new project', async () => {
    const createdProject = await service.createNewProject('project name', 'master');

    const expected: ProjectProps = {
      id: 'generated-id',
      name: 'project name',
      defaultBranch: 'master',
      metricsConfig: [],
    };

    expect(createdProject.getProps()).toEqual(expected);

    const savedProject = await projectStore.findById(createdProject.id);
    expect(savedProject?.getProps()).toEqual(expected);
  });

  it('adds a metric configuration to a project', async () => {
    const project = createProject();

    await projectStore.save(project);

    await service.addMetricConfiguration(project.id, 'Linter warnings', 'number', 'integer');

    const savedProject = await projectStore.findById(project.id);

    expect(savedProject?.getMetricsConfig()).toEqual([
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
    const project = createProject({
      metricsConfig: [
        new MetricConfiguration({ label: 'existing', type: 'number', unit: 'number' }),
      ],
    });

    await projectStore.save(project);

    await expect(
      service.addMetricConfiguration(project.id, 'existing', 'number', 'number'),
    ).rejects.toThrow(MetricConfigurationLabelAlreadyExistsError);
  });
});
