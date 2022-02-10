import { AppThunkAction } from '~/store';

import {
  setLoadingProjects,
  setLoadingSnapshots,
  setProject,
  setProjectSnapshots,
} from '../../project.actions';

export const loadProject = (projectId: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));

      const project = await projectGateway.fetchProject(projectId);

      if (project) {
        dispatch(
          setProject({
            ...project,
            snapshots: [],
            loadingSnapshots: false,
            creatingMetric: false,
          }),
        );

        await dispatch(loadSnapshots(projectId));
      } else {
        console.warn(`cannot find project ${projectId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingProjects(false));
    }
  };
};

export const loadSnapshots = (projectId: string, branch?: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingSnapshots(projectId, true));

      const snapshots = await projectGateway.fetchSnapshots(projectId, branch);

      dispatch(setProjectSnapshots(projectId, snapshots));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingSnapshots(projectId, false));
    }
  };
};
