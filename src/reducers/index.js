// @ts-check

import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/index.js';

const channelsInfo = createReducer(
  { channels: {}, currentChannelId: null },
  {
    [actions.setInitialState](state, { payload: { channels, currentChannelId } }) {
      return { channels, currentChannelId };
    },
    [actions.setCurrentChannel](state, { payload: { currentChannelId } }) {
      const { channels } = state;
      return { channels, currentChannelId };
    },
    [actions.addChannel](state, { payload: { channel } }) {
      const { channels, currentChannelId } = state;
      const newChannels = [...channels, channel];
      return { channels: newChannels, currentChannelId };
    },
  },
);

const messagesInfo = createReducer(
  { messages: {} },
  {
    [actions.setInitialState](state, { payload: { messages } }) {
      return { messages };
    },
    [actions.addMessage](state, { payload: { message } }) {
      const { messages } = state;
      return { messages: [...Object.values(messages), message] };
    },
  },
);

export default {
  channelsInfo,
  messagesInfo,
};
