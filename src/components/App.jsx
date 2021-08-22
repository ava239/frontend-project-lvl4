// @ts-check

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import {
  Button,
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoginPage from './LoginPage.jsx';
import MainPage from './MainPage.jsx';
import { authContext } from '../contexts/index.jsx';
import { useAuth, useSocket } from '../hooks/index.jsx';
import NoMatch from './NoMatchPage.jsx';

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

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('logout')}</Button>
      : null
  );
};

const App = () => {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <Router>
          <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('brand')}</Navbar.Brand>
              <Nav className="mr-auto" />
              <AuthButton />
            </Container>
          </Navbar>
          <Switch>
            <Route path="/login">
              <LoginPage />
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
};
export default App;
