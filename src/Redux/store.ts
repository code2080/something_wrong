import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';

const configureStore = (initialState: any = {}) => {
  const enhancers = (<any[]>[]);
  const middleware = [thunk];

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  );

  const store = createStore(rootReducer, initialState, composedEnhancers);
  (window as any).store = store;
  return store;
};

export default configureStore;
