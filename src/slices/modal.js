import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpened: false, type: null, extra: null };

const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload: { type, extra = null } }) => ({ isOpened: true, type, extra }),
    closeModal: () => initialState,
  },
});
export const { openModal, closeModal } = modal.actions;
export default modal.reducer;
