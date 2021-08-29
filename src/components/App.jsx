// @ts-check

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import MainPage from './MainPage.jsx';
import { authContext } from '../contexts';
import { useAuth, useSocket } from '../hooks';
import NoMatch from './NoMatchPage.jsx';
import Navigation from './Navigation.jsx';

const AuthProvider = ({ children }) => {
  const storageUser = JSON.parse(localStorage.getItem('user')) ?? {};

  const [user, setUser] = useState(storageUser);
  const userLoggedIn = Boolean(user && user.token);
  const [loggedIn, setLoggedIn] = useState(userLoggedIn);
  const socket = useSocket();

  const logIn = (data) => {
    setLoggedIn(true);
    setUser(data);
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
    setUser({});
    socket.disconnect();
    socket.removeAllListeners();
  };

  return (
    <authContext.Provider value={{
      loggedIn,
      logIn,
      logOut,
      username: user.username,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const App = () => (
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <Router>
        <Navigation />
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <PrivateRoute exact path="/">
            <MainPage />
          </PrivateRoute>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    </div>
  </AuthProvider>
);
export default App;
