import { createSelector } from '@reduxjs/toolkit';

import { AppSelector, AppState } from '~/store';

import { projectsStateAdapter, ProjectStateSlice } from './project.slice';
import { Project } from './types/Project';

const selectProjectsSlice: AppSelector<ProjectStateSlice> = (state) => {
  return state.projects;
};

const adapterSelectors = projectsStateAdapter.getSelectors<AppState>(selectProjectsSlice);

export const selectProjectUnsafe = adapterSelectors.selectById;

// prettier-ignore
export const {
  selectAll: selectProjects,
  selectTotal: selectTotalProjects,
} = adapterSelectors;

export const selectProject: AppSelector<Project, [string]> = (state, projectId) => {
  const project = selectProjectUnsafe(state, projectId);

  if (!project) {
    throw new Error(`expected project "${projectId}" to be defined`);
  }

  return project;
};

export const selectLoadingProjects = createSelector(selectProjectsSlice, ({ loading }) => {
  return loading;
});

export const selectIsMetricCreationFormOpen = createSelector(selectProject, ({ metricCreationFormOpen }) => {
  return metricCreationFormOpen;
});

export const selectCreatingMetric = createSelector(selectProject, ({ creatingMetric }) => {
  return creatingMetric;
});
