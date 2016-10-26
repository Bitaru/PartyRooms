import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Root from '../../app/containers/Root';
import createStore from '../../app/store/createStore';

window.Raven.config(SETTINGS.sentry).install();

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.querySelector('#root')
);
