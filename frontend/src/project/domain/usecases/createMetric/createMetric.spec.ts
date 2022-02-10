import expect from 'expect';
import { fn } from 'jest-mock';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { TestStore } from '~/store';

import { selectIsMetricCreationFormOpen, setMetricConfigurationFormOpen } from '../..';
import { setProject } from '../../project.actions';
import { selectCreatingMetric, selectProject } from '../../project.selectors';
import { createProject } from '../../types/Project';

import { createMetric } from './createMetric';

describe('createMetric', () => {
  let store: TestStore;

  beforeEach(() => {
    store = new TestStore();
  });

  const projectId = 'project-id';

  beforeEach(() => {
    store.dispatch(setProject(createProject({ id: projectId })));
  });

  it('creates a new metric configuration', async () => {
    const promise = store.dispatch(
      createMetric(projectId, {
        label: 'label',
        type: MetricTypeEnum.number,
      }),
    );

    expect(store.select(selectCreatingMetric, projectId)).toBe(true);

    await promise;

    expect(store.select(selectCreatingMetric, projectId)).toBe(false);

    expect(store.select(selectProject, projectId)).toMatchObject({
      metrics: [
        {
          id: 'metricId',
          label: 'label',
          type: MetricTypeEnum.number,
        },
      ],
    });
  });

  it('clears the form when the metric was created', async () => {
    const clear = fn();

    await store.dispatch(
      createMetric(
        projectId,
        {
          label: 'label',
          type: MetricTypeEnum.number,
        },
        clear,
      ),
    );

    expect(clear).toHaveBeenCalled();
  });

  it('closes the form when the metric was created', async () => {
    store.dispatch(setMetricConfigurationFormOpen(projectId, true));

    await store.dispatch(
      createMetric(projectId, {
        label: 'label',
        type: MetricTypeEnum.number,
      }),
    );

    expect(store.select(selectIsMetricCreationFormOpen, projectId)).toBe(false);
  });
});
