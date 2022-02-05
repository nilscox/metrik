import { createSelector } from '@reduxjs/toolkit';

import { AppState } from '~/store';

import { selectProject } from '../../project.selectors';

export const selectProjectMetrics = (state: AppState, projectId: string) => {
  const project = selectProject(state, projectId);

  return project.metrics;
};

export const selectMetric = (state: AppState, projectId: string, metricId: string) => {
  const metrics = selectProjectMetrics(state, projectId);

  return metrics.find((metric) => metric.id === metricId);
};

export const selectMetricLabel = createSelector(selectMetric, (metric) => {
  return metric?.label;
});

export const selectMetricType = createSelector(selectMetric, (metric) => {
  return metric?.type;
});

export const selectMetricUnitDisplayValue = createSelector(selectMetricType, (type) => {
  if (type === 'number') {
    return undefined;
  }

  if (type === 'duration') {
    return 'sec';
  }

  if (type === 'percentage') {
    return '%';
  }

  return type;
});
