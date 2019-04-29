import React from 'react';
import renderer, { act } from 'react-test-renderer';
import RootProvider from '../../root/provider';
import { createRootStore } from '../../root/store';
import App1 from './app1';
import App2 from './app2';
import App3 from './app3';

const store = createRootStore({
  debug: true,
  state: {
    text: 'hello root store'
  }
});

function App() {
  return (
    <RootProvider store={store}>
      <App1 />
      <App2 />
      <App3 />
    </RootProvider>
  );
}

it('test basic root provider', () => {
  const tree = renderer.create(<App />);
  expect(tree).toMatchSnapshot();
  expect(global['Root']).toMatchSnapshot();
});

it('test update app', () => {
  const tree = renderer.create(<App />);
  act(() => {
    global['dispatchApp1']();
  });
  expect(tree).toMatchSnapshot();
});

it('test update global', () => {
  const tree = renderer.create(<App />);
  act(() => {
    global['dispatchApp2Global']();
  });
  expect(tree).toMatchSnapshot();
});
