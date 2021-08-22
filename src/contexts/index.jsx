import { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io({ autoConnect: false });

export const authContext = createContext({});
export const socketContext = createContext(socket);
