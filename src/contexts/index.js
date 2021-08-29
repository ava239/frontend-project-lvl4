import { createContext } from 'react';

export const authContext = createContext({});
export const socketContext = createContext({});

export const withTimeout = (onSuccess, onTimeout, timeout = 3000) => {
  // eslint-disable-next-line functional/no-let
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess(...args);
  };
};
