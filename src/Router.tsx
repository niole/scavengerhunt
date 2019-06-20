import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/home';

const routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
    </div>
  </Router>
);

export default routes;
