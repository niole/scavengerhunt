import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './views/home';
import Hunt from './views/hunt';

const routes = () => (
  <Router>
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route exact path="/hunt/:huntId/:creatorId" component={Hunt} />
    </Switch>
  </Router>
);

export default routes;
