import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Provider from '../../../provider';
import Text from './component/text';
import store from './store';

export default function App1() {
  return (
    <Provider store={store}>
      <Text />
    </Provider>
  );
}

it('App1 test init', () => {
  const tree = renderer.create(<App1 />);
  expect(tree).toMatchSnapshot();
});

it('test update app1', () => {
  const tree = renderer.create(<App1 />);
  act(() => {
    global['dispatchApp1']();
  });
  expect(tree).toMatchSnapshot();
});
