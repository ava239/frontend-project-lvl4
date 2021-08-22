import { createAction } from '@reduxjs/toolkit';

export const setInitialState = createAction('channelsInfo/setInitialState');
export const setCurrentChannel = createAction('channelsInfo/setCurrentChannel');
export const addMessage = createAction('messagesInfo/addMessage');
