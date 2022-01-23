import { createEntityAdapter, createSelector, createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';

import { AppState } from '../../store/store';

type Metric = {
  label: string;
  value: number;
};

type MetricsSnapshot = {
  date: string;
  metrics: Metric[];
};

type MetricsConfig = {
  label: string;
  unit: string;
  type: string;
};

type Project = {
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

export const projectsReducer = projectsSlice.reducer;

export const { setLoadingProjects, setProjects, setProject } = projectsSlice.actions;

const selectProjectsSlice: Selector<AppState, ProjectStateSlice> = (state) => state.projects;
export const selectLoadingProjects = createSelector(selectProjectsSlice, ({ loading }) => loading);

export const {
  selectAll: selectProjects,
  selectById: selectProject,
  selectTotal: selectTotalProjects,
} = projectsAdapter.getSelectors<AppState>(selectProjectsSlice);

export const selectSnapshots = createSelector(selectProject, (project) =>
  project?.snapshots.map((snapshot) => ({
    ...snapshot,
    date: new Date(snapshot.date),
  })),
);

export const selectLastSnapshot = createSelector(
  selectSnapshots,
  (snapshots) => snapshots?.[snapshots?.length - 1],
);

export const selectLastSnapshotDate = createSelector(selectLastSnapshot, (snapshot) => {
  if (!snapshot) {
    return;
  }

  const date = snapshot.date;

  return [
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-'),
    [date.getHours(), date.getMinutes()].join(':'),
  ].join(' ');
});

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
