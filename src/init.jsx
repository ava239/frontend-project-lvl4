// @ts-check

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import channelsInfo from './slices/channels';
import messagesInfo from './slices/messages';
import modal from './slices/modal';
import App from './components/App.jsx';

const store = configureStore({
  reducer: {
    channelsInfo,
    messagesInfo,
    modal,
  },
});

const init = () => render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('chat'),
);

export default init;
