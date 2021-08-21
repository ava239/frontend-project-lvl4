// @ts-check

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducers/index.js';
import App from './components/App.jsx';

const store = configureStore({ reducer });

const init = () => render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('chat'),
);

export default init;
