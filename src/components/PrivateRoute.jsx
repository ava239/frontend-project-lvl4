import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default () => (
  <Route
    render={({ location }) => (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    )}
  />
);
