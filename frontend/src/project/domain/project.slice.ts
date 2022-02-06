import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export type ProjectStateSlice = typeof initialState;

export const projectsReducer = projectsSlice.reducer;
export const projectsActions = projectsSlice.actions;
