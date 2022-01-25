import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '~/store/store';

import { selectProject } from '../../project.selectors';

export const selectMetricConfig = (state: AppState, projectId: string, label: string) => {
  const project = selectProject(state, projectId);

  return project?.metricsConfig.find((config) => config.label === label);
};

export const selectMetricUnit = createSelector(selectMetricConfig, (config) => config?.unit);

export const selectMetricUnitDisplayValue = createSelector(selectMetricUnit, (unit) => {
  if (unit === 'number') {
    return undefined;
  }

  if (unit === 'seconds') {
    return 'sec';
  }

  if (unit === 'percent') {
    return '%';
  }

  return unit;
});
