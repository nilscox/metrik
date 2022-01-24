import { createSelector } from '@reduxjs/toolkit';

import { selectProject } from '../../project.slice';

export const selectSnapshots = createSelector(selectProject, (project) => {
  return project?.snapshots.map((snapshot) => ({
    ...snapshot,
    date: new Date(snapshot.date),
  }));
});

export const selectLastSnapshot = createSelector(selectSnapshots, (snapshots) => {
  return snapshots?.[snapshots.length - 1];
});
