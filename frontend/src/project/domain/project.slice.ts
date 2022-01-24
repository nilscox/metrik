import { createEntityAdapter, createSelector, createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';

import { AppState } from '../../store/store';

export type Metric = {
  label: string;
  value: number;
};

export type MetricsSnapshot = {
  date: string;
  metrics: Metric[];
};

type MetricsConfig = {
  label: string;
  unit: string;
  type: string;
};

export type Project = {
  id: string;
  name: string;
  defaultBranch: string;
  metricsConfig: MetricsConfig[];
  snapshots: MetricsSnapshot[];
};

const projectsAdapter = createEntityAdapter<Project>();

const initialState = projectsAdapter.getInitialState({
  loading: false,
});

type ProjectStateSlice = typeof initialState;

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoadingProjects(state, { payload: loading }: PayloadAction<boolean>) {
      state.loading = loading;
    },
    setProjects: projectsAdapter.setAll,
    setProject: projectsAdapter.setOne,
  },
});

export const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'id',
  name: 'name',
  defaultBranch: 'defaultBranch',
  metricsConfig: [],
  snapshots: [],
  ...overrides,
});

export const createMetricsSnapshot = (overrides: Partial<MetricsSnapshot> = {}): MetricsSnapshot => ({
  date: '2022-01-01T00:00:00.000Z',
  metrics: [],
  ...overrides,
});

export const projectsReducer = projectsSlice.reducer;

export const { setLoadingProjects, setProjects, setProject } = projectsSlice.actions;

const selectProjectsSlice: Selector<AppState, ProjectStateSlice> = (state) => state.projects;
export const selectLoadingProjects = createSelector(selectProjectsSlice, ({ loading }) => loading);

export const {
  selectAll: selectProjects,
  selectById: selectProject,
  selectTotal: selectTotalProjects,
} = projectsAdapter.getSelectors<AppState>(selectProjectsSlice);

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
