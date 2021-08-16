import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import Login from './Login.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import NoMatch from './NoMatch.jsx';

export default () => (
  <Router>
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">Chat</Link>
      </div>
    </nav>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <PrivateRoute exact path="/" />
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  </Router>
);
