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
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import NoMatch from './NoMatchPage.jsx';

const AuthProvider = ({ children, user = {} }) => {
  const userLoggedIn = Boolean(user && user.token);
  const [loggedIn, setLoggedIn] = useState(userLoggedIn);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
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
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <AuthProvider user={user}>
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
