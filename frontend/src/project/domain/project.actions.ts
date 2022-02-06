import { projectsActions } from './project.slice';

import { MetricsSnapshot } from '.';

// prettier-ignore
export const {
  setLoadingProjects,
  setProjects,
  setProject,
} = projectsActions;

const { updateProject } = projectsActions;

export const setLoadingSnapshots = (projectId: string, loading: boolean) => {
  return updateProject({ id: projectId, changes: { loadingSnapshots: loading } });
};

export const setProjectSnapshots = (projectId: string, snapshots: MetricsSnapshot[]) => {
  return updateProject({ id: projectId, changes: { snapshots } });
};
