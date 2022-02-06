import { AppThunkAction } from '~/store';

import { setProjectSnapshots } from '../..';
import { setLoadingSnapshots } from '../../project.actions';

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
