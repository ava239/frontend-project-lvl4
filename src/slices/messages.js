import { createSlice } from '@reduxjs/toolkit';
import { removeChannel, setInitialState } from './channels.js';

const messagesInfo = createSlice({
  name: 'messagesInfo',
  initialState: { messages: {} },
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      const { messages } = state;
      return { messages: [...Object.values(messages), message] };
    },
  },
  extraReducers: {
    [setInitialState]: (state, { payload: { messages } }) => ({ messages }),
    [removeChannel]: (state, { payload: { channelId } }) => {
      const { messages } = state;
      const newMessages = messages.filter((m) => m.channelId !== channelId);
      return { messages: newMessages };
    },
  },
});
export const { addMessage } = messagesInfo.actions;
export default messagesInfo.reducer;
