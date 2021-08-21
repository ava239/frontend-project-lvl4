// @ts-check

import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/index.js';

const channels = createReducer(
  { byId: {}, allIds: [] },
  {
    [actions.initData](state, { payload }) {
      return {
        byId: payload.channels,
        allIds: Object.keys(payload.channels),
      };
    },
  },
);

const messages = createReducer(
  { byId: {}, allIds: [] },
  {
    [actions.initData](state, { payload }) {
      return {
        byId: payload.messages,
        allIds: Object.keys(payload.messages),
      };
    },
  },
);

const currentChannelId = createReducer(null, {
  [actions.initData](state, { payload }) {
    return payload.currentChannelId;
  },
});

export default {
  channels,
  messages,
  currentChannelId,
};
