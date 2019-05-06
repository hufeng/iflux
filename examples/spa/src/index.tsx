import createHistory from 'history/createBrowserHistory';
import { createRootStore, RootProvider } from 'iflux';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import AsyncRoute from './async-route';

const SPA = () => (
  <RootProvider store={createRootStore({ debug: true })}>
    <Router history={createHistory()}>
      <div>
        <AsyncRoute exact path='/' load={() => import('./hello')} />
        <AsyncRoute path='/like' load={() => import('./like')} />
      </div>
    </Router>
  </RootProvider>
);

ReactDOM.render(<SPA />, document.getElementById('app'));
