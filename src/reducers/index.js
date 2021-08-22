// @ts-check

import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/index.js';

const channelsInfo = createReducer(
  { channels: {}, currentChannelId: null },
  {
    [actions.setInitialState](state, { payload: { channels, currentChannelId } }) {
      return { channels, currentChannelId };
    },
  },
);

const messagesInfo = createReducer(
  { messages: {} },
  {
    [actions.setInitialState](state, { payload: { messages } }) {
      return { messages };
    },
  },
);

export default {
  channelsInfo,
  messagesInfo,
};
