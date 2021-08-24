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
    removeChannel: (state, { payload: { channelId } }) => {
      const { channels, currentChannelId } = state;
      const newChannels = channels.filter(({ id }) => channelId !== id);
      const newChannelId = currentChannelId !== channelId ? currentChannelId : 1;
      return { channels: newChannels, currentChannelId: newChannelId };
    },
  },
});
export const {
  setInitialState,
  setCurrentChannel,
  addChannel,
  removeChannel,
} = channelsInfo.actions;
export default channelsInfo.reducer;
