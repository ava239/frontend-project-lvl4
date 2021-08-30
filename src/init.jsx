// @ts-check

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Rollbar from 'rollbar';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import channelsInfo from './slices/channels';
import messagesInfo from './slices/messages';
import modal from './slices/modal';
import App from './components/App.jsx';
import ru from './i18n/ru.js';

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
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    resources: { ru },
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18nextInstance}>
        <App socket={socket} />
      </I18nextProvider>
    </Provider>
  );
};

export default init;
