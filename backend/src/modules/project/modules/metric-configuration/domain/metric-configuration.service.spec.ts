import expect from 'expect';

import { MetricConfigurationLabelAlreadyExistsError } from '~/modules/project/domain/errors/metric-configuration-label-already-exists.error';
import { EntityNotFoundError } from '~/utils/entity-not-found.error';

import {
  createMetricsConfiguration,
  createProject,
  MetricConfiguration,
  Project,
} from '../../../domain/project';
import { InMemoryProjectStore } from '../../../project-aggregate';

import { MetricConfigurationService } from './metric-configuration.service';

describe('MetricConfigurationService', () => {
  let projectStore: InMemoryProjectStore;
  let service: MetricConfigurationService;

  beforeEach(() => {
    projectStore = new InMemoryProjectStore();
    service = new MetricConfigurationService(projectStore);
  });

  const save = async (project: Project) => {
    await projectStore.save(project);
    return project;
  };

  const find = async (id: string) => {
    return projectStore.findByIdOrFail(id);
  };

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

  it('prevents to add a metric configuration having the same label twice', async () => {
    const metricsConfig = [createMetricsConfiguration({ label: 'existing' })];
    const project = await save(createProject({ metricsConfig }));

    await expect(
      service.addMetricConfiguration(project.id, 'existing', 'number', 'number'),
    ).rejects.toThrow(MetricConfigurationLabelAlreadyExistsError);
  });
});
