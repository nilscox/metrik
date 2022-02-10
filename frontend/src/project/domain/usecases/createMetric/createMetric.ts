import { ICreateMetricDto } from '@shared/dtos/project/ICreateMetricDto';
import { AppThunkAction } from '~/store';

import { addMetric, setCreatingMetric, setMetricConfigurationFormOpen } from '../../project.actions';

export const createMetric = (
  projectId: string,
  input: Omit<ICreateMetricDto, 'id'>,
  clearForm?: () => void,
): AppThunkAction => {
  return async (dispatch, _getState, { projectGateway }) => {
    dispatch(setCreatingMetric(projectId, true));

    try {
      const createdMetric = await projectGateway.createMetric(projectId, input);

      dispatch(addMetric({ projectId, metric: createdMetric }));

      clearForm?.();
      dispatch(setMetricConfigurationFormOpen(projectId, false));
    } finally {
      dispatch(setCreatingMetric(projectId, false));
    }
  };
};
