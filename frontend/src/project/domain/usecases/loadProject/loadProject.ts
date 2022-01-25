import { AppThunkAction } from '~/store';

import { setLoadingProjects, setProject } from '../../project.actions';

export const loadProject = (projectId: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));

      const project = await projectGateway.fetchProject(projectId);

      if (project) {
        dispatch(setProject(project));
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
