import { AppThunkAction } from '~/store';

import { setLoadingProjects, setProject } from '../../project.actions';

import { loadSnapshots } from './loadSnapshots';

export const loadProject = (projectId: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));

      const project = await projectGateway.fetchProject(projectId);

      if (project) {
        dispatch(setProject({ ...project, loadingSnapshots: false, snapshots: [] }));
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
