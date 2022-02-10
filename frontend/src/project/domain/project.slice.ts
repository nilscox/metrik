import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Metric } from './types/Metric';
import { Project } from './types/Project';

export const projectsStateAdapter = createEntityAdapter<Project>();

const initialState = projectsStateAdapter.getInitialState({
  loading: false,
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoadingProjects(state, { payload: loading }: PayloadAction<boolean>) {
      state.loading = loading;
    },
    setProjects: projectsStateAdapter.setAll,
    setProject: projectsStateAdapter.setOne,
    updateProject: projectsStateAdapter.updateOne,
    addMetric(state, { payload }: PayloadAction<{ projectId: string; metric: Metric }>) {
      const metrics = state.entities[payload.projectId]?.metrics ?? [];

      projectsStateAdapter.updateOne(state, {
        id: payload.projectId,
        changes: { metrics: [...metrics, payload.metric] },
      });
    },
  },
});

export type ProjectStateSlice = typeof initialState;

export const projectsReducer = projectsSlice.reducer;
export const projectsActions = projectsSlice.actions;
