import { createSlice } from '@reduxjs/toolkit';
import { setInitialState } from './channels.js';

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
  },
});
export const { addMessage } = messagesInfo.actions;
export default messagesInfo.reducer;
