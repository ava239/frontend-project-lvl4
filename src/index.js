// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import { io } from 'socket.io-client';
import init from './init.jsx';
import './i18n/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io({ autoConnect: false });

init(socket);
