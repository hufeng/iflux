import createHistory from 'history/createBrowserHistory';
import { RootProvider } from 'iflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import HelloApp from './hello';
import LikeApp from './like';

const SPA = () => (
  <RootProvider>
    <Router history={createHistory()}>
      <div>
        <Route exact path='/' component={HelloApp} />
        <Route path='/like' component={LikeApp} />
      </div>
    </Router>
  </RootProvider>
);

ReactDOM.render(<SPA />, document.getElementById('app'));
