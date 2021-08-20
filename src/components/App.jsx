// @ts-check

import React, { useContext, useState } from 'react';
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
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import NoMatch from './NoMatchPage.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
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
  const auth = useContext(authContext);

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Log out</Button>
      : null
  );
};

export default () => {
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
