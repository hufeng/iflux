import React from 'react';
import renderer from 'react-test-renderer';
import { createStore, Provider, TRelaxProps } from '../index';
import { Relax, useRelax } from '../relax';

interface IBlog {
  id: number;
  title: string;
  content: string;
}

const store = createStore({
  state: {
    id: 1,
    title: '',
    content: ''
  }
});

function Hello() {
  const { id, title, content } = useRelax<IBlog>(['id', 'title', 'content']);

  return (
    <div>
      <div>{id}</div>
      <div>{title}</div>
      <div>{content}</div>
    </div>
  );
}

@Relax(['id', 'title', 'content'])
class RelaxComponent extends React.Component {
  relaxProps = {} as TRelaxProps<IBlog>;

  render() {
    const { id, title, content } = this.relaxProps;
    return (
      <div>
        <div>{id}</div>
        <div>{title}</div>
        <div>{content}</div>
      </div>
    );
  }
}

function App() {
  return (
    <Provider
      store={store}
      onMounted={store => {
        store.setState(state => {
          state.id = 1;
          state.title = 'hello iflux';
          state.content = 'Ok';
        });
      }}
    >
      <Hello />
      <RelaxComponent />
    </Provider>
  );
}

it('test didmount', () => {
  const tree = renderer.create(<App />);
  expect(tree).toMatchSnapshot();
});
