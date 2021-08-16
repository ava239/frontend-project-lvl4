import React from "react";
import { Redirect, Route } from "react-router-dom";

export default ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location }
          }}
        />
      }
    />
  );
}

