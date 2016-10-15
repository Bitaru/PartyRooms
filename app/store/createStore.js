import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const middleware = applyMiddleware(thunk);

export default () => {
  const creator = middleware(createStore);
  const store = creator(reducer);

  chrome.runtime.onMessage.addListener(({ type, key, ...data }) =>
    store.dispatch({ type, key, data })
  );

  return store;
};
