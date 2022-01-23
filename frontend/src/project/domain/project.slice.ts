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
  },
});

export const projectsReducer = projectsSlice.reducer;

export const { setLoadingProjects, setProjects } = projectsSlice.actions;

const selectProjectsSlice: Selector<AppState, ProjectStateSlice> = (state) => state.projects;
export const selectLoadingProjects = createSelector(selectProjectsSlice, ({ loading }) => loading);

export const {
  selectAll: selectProjects,
  selectById: selectProject,
  selectTotal: selectTotalProjects,
} = projectsAdapter.getSelectors<AppState>(selectProjectsSlice);
