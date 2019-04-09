import { Provider } from 'iflux';
import React from 'react';
import { render } from 'react-dom';
import { Command } from './command';
import Footer from './component/footer';
import Header from './component/header';
import Main from './component/main-section';
import './css/base.css';
import './css/index.css';
import store from './store';

const TodoApp = () => (
  <Provider store={store} onMounted={store => store.dispatch(Command.INIT)}>
    <section className='todoapp'>
      <Header />
      <Main />
      <Footer />
    </section>
  </Provider>
);

render(<TodoApp />, document.getElementById('app'));
