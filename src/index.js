// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import init from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io({ autoConnect: false });

render(
  init(socket),
  document.getElementById('chat'),
);
