import { AppThunkAction } from '~/store';

import { setLoadingProjects, setProject } from '../../project.actions';

export const loadProject = (projectId: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));

      const project = await projectGateway.fetchProject(projectId);
      const snapshots = await projectGateway.fetchSnapshots(projectId);

      if (project) {
        dispatch(setProject({ ...project, snapshots }));
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
