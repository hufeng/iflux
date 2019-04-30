import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Provider from '../../../provider';
import Hello from './component/hello';
import Text from './component/text';
import store from './store';

export default function App2() {
  return (
    <Provider store={store}>
      <Text />
      <Hello />
    </Provider>
  );
}

it('App2 basic', () => {
  const tree = renderer.create(<App2 />);
  expect(tree).toMatchSnapshot();
});

it('app2 test update', () => {
  const tree = renderer.create(<App2 />);
  act(() => {
    global['dispatchApp2']();
  });
  expect(tree).toMatchSnapshot();
});
