import React from 'react';
import render, { act } from 'react-test-renderer';
import { createStore, Provider, Relax, useRelax } from '../index';
import { TRelaxProps } from '../types';
import * as _ from '../util';

type TProps = {
  id: number;
  lname: string;
  name: string;
};

const store = createStore({
  ns: 'relax-test',
  state: {
    name: 'test',
    list: [{ id: 1, name: 'test' }]
  }
});

function TestRelax() {
  const { id, lname, name, setState, dispatch } = useRelax<TProps>([
    ['list', 0, 'id'],
    { lname: 'list.0.name' },
    'name'
  ]);

  return (
    <div>
      {id}
      {name}
      {lname}
      {_.isFn(dispatch) && 'yes'}
      {_.isFn(setState) && 'yes'}
    </div>
  );
}

@Relax([
  //
  ['list', 0, 'id'],
  { lname: 'list.0.name' },
  'name'
])
class RelaxTest extends React.Component {
  relaxProps = {} as TRelaxProps<TProps>;

  render() {
    const { id, name, lname, setState, dispatch } = this.relaxProps;
    return (
      <div>
        {id}
        {name}
        {lname}
        {_.isFn(dispatch) && 'yes'}
        {_.isFn(setState) && 'yes'}
      </div>
    );
  }
}

const TestApp = () => (
  <Provider store={store} debug>
    <TestRelax />
    <RelaxTest />
  </Provider>
);

it('test init', () => {
  const tree = render.create(<TestApp />);
  expect(tree).toMatchSnapshot();

  act(() => {
    global['relax-test'].store.setState(state => {
      state.list[0].id = 2;
    });
  });

  expect(tree).toMatchSnapshot();
});

it('test no subscribe', () => {
  const RelaxApp = () => {
    useRelax([]);
    return <div />;
  };

  const TestApp = () => (
    <Provider store={store}>
      <RelaxApp />
    </Provider>
  );

  const tree = render.create(<TestApp />);
  expect(tree).toMatchSnapshot();
});

it('test defaultInject setState and dispatch', () => {
  const RelaxApp = () => {
    const { setState } = useRelax([]);
    return <div>{_.isFn(setState) && 'yes'}</div>;
  };

  const TestApp = () => (
    <Provider store={store}>
      <RelaxApp />
    </Provider>
  );

  const tree = render.create(<TestApp />).toJSON();
  expect(tree).toMatchSnapshot();
});
