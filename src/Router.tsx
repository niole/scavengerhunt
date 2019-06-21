import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/home';
import Hunt from './views/hunt';

const routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/hunt/:huntId/:creatorId" component={Hunt} />
    </div>
  </Router>
);

export default routes;
