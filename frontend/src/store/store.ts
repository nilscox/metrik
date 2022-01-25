import { AnyAction, configureStore, Selector, ThunkAction } from '@reduxjs/toolkit';

import { projectsReducer } from '~/project/domain/project.slice';

import { ProjectGateway } from './ProjectGateway';

export const createStore = (dependencies: Dependencies) => {
  return configureStore({
    reducer: {
      projects: projectsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }),
  });
};

export type AppAction = AnyAction;

export type AppStore = ReturnType<typeof createStore>;

export type GetAppState = AppStore['getState'];
export type AppDispatch = AppStore['dispatch'];

export type AppState = ReturnType<GetAppState>;

export type Dependencies = {
  projectGateway: ProjectGateway;
};

export type AppThunkAction<Return = void> = ThunkAction<Return, AppState, Dependencies, AppAction>;

export type AppSelector<Result, Params extends unknown[] = []> = Selector<AppState, Result, Params>;
