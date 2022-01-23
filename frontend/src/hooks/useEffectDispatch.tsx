import { DependencyList, useEffect } from 'react';

import { AppDispatch } from '../store/store';

import { useAppDispatch } from './useAppDispatch';

export const useEffectDispatch = (actionOrThunk: Parameters<AppDispatch>[0], deps: DependencyList) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actionOrThunk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
