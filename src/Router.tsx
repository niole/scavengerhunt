import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './views/home';
import Hunt from './views/hunt';
import Invite from './views/invite';
import Play from './views/play';
import Success from './views/success';

const routes = () => (
  <Router>
    <Switch>
      <Route exact path="/success/:teamId" component={Success} />
      <Route exact path="/play/:huntId/:memberId" component={Play} />
      <Route exact path="/create" component={Home} />
      <Route exact path="/hunt/:huntId/:creatorId" component={Hunt} />
      <Route exact path="/invite/:huntId/:creatorId" component={Invite} />
    </Switch>
  </Router>
);

export default routes;
