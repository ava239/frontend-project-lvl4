// @ts-check

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Rollbar from 'rollbar';
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

const init = (socket) => {
  Rollbar.init({
    accessToken: '71863b44bef048699273abc48716ce56',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: { environment: window.location.host },
  });

  return render(
    <Provider store={store}>
      <App socket={socket} />
    </Provider>,
    document.getElementById('chat'),
  );
};

export default init;
