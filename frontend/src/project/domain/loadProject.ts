import { AppThunkAction } from '../../store/store';

import { setLoadingProjects, setProjects } from './project.slice';

export const loadProjects = (): AppThunkAction => {
  return async (dispatch, getState, { projectGateway }) => {
    try {
      dispatch(setLoadingProjects(true));
      const projects = await projectGateway.fetchProjects();
      dispatch(setProjects(projects));
    } finally {
      dispatch(setLoadingProjects(false));
    }
  };
};
