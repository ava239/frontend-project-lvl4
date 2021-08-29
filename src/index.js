// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import Rollbar from 'rollbar';
import init from './init.jsx';
import './i18n/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

Rollbar.init({
  accessToken: '71863b44bef048699273abc48716ce56',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: { environment: window.location.host },
});

init();
