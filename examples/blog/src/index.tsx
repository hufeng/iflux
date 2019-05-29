import { RootProvider } from 'iflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Blog from './blog';
import BlogDetail from './blog-detail';
import BlogCreate from './blog-new';

ReactDOM.render(
  <RootProvider debug>
    <Router>
      <Route path='/' component={Blog} />
      <Route exact path='/blog/new' component={BlogCreate} />
      <Route exact path='/blog/:id' component={BlogDetail} />
    </Router>
  </RootProvider>,
  document.getElementById('app')
);
