import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Provider from '../provider';
import { useRelax } from '../relax';

function Text() {
  const { text, setState } = useRelax(['text']);

  global['change'] = () =>
    setState(state => {
      state.text = 'hello world';
    });

  return <div>{text}</div>;
}

function App() {
  return (
    <Provider>
      <Text />
    </Provider>
  );
}

it('test default store', () => {
  const tree = renderer.create(<App />);
  expect(tree).toMatchSnapshot();
  act(() => {
    global['change']();
  });
  expect(tree).toMatchSnapshot();
});
