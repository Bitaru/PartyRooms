import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import reducer from './reducer';
import storage from './chromeStore';

const middleware = [thunk];

export default () => {
  const creator = compose(applyMiddleware(...middleware), autoRehydrate())(createStore);
  const store = creator(reducer);
  persistStore(store, {
    active: true,
    storage
  });

  chrome.runtime.onMessage.addListener(({ type, key, data }) =>
    store.dispatch({ type, key, data })
  );

  return store;
};
