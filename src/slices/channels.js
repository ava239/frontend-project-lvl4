import { createSlice } from '@reduxjs/toolkit';

const channelsInfo = createSlice({
  name: 'channelsInfo',
  initialState: { channels: {}, currentChannelId: null },
  reducers: {
    setInitialState: (state, { payload: { channels, currentChannelId } }) => (
      { channels, currentChannelId }
    ),
    setCurrentChannel: (state, { payload: { currentChannelId } }) => {
      const { channels } = state;
      return { channels, currentChannelId };
    },
    addChannel: (state, { payload: { channel } }) => {
      const { channels, currentChannelId } = state;
      const newChannels = [...channels, channel];
      return { channels: newChannels, currentChannelId };
    },
  },
});
export const { setInitialState, setCurrentChannel, addChannel } = channelsInfo.actions;
export default channelsInfo.reducer;
