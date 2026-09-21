import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '@/reducers';
import rootSaga from '@/sagas';
// import { isDev, isServer } from '@/config';

// const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
//   if (typeof action === 'function') {
//     // console.log('[Logger] thunk-like: ', action);
//     return action(dispatch, getState);
//   }
//   // console.log('[Logger] dispatch: ', action);
//   return next(action);
// };

const createStore = (preloadedState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewareEnhancer = (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: false,
    serializableCheck: {
      ignoredActionPaths: ['payload.data'],
    },
  })
    .concat(
      // ...(isDev ? [loggerMiddleware] : []),
      sagaMiddleware,
    );

  const store = configureStore({
    reducer: rootReducer,
    middleware: middlewareEnhancer,
    // devTools: !isServer && isDev,
    preloadedState,
  });

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default createStore;
