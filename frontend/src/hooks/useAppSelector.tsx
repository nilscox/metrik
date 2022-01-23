import { useSelector } from 'react-redux';

import { AppSelector, AppState } from '../store/store';

export const useAppSelector = <Result, Params extends unknown[]>(
  selector: AppSelector<Result, Params>,
  ...params: Params
) => {
  return useSelector<AppState, Result>((state) => selector(state, ...params));
};
