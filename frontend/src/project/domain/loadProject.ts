import { AppThunkAction } from '../../store/store';

import { setLoadingProjects, setProject } from './project.slice';

export const loadProject = (projectId: string): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));
      dispatch(setProject(await projectGateway.fetchProject(projectId)));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingProjects(false));
    }
  };
};
