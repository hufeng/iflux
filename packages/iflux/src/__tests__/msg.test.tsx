import React, { useState } from 'react';
import renderer, { act } from 'react-test-renderer';
import { msg, useMsg } from '../msg';

it('test msg', () => {
  msg.on('hello', hello => {
    expect(hello).toEqual('hello');
  });

  msg.emit('hello', 'hello');
});

it('test useMsg', () => {
  function Test() {
    const [text, setState] = useState('test');
    useMsg({
      hello: hello => {
        act(() => setState(hello));
      }
    });

    return <div>{text}</div>;
  }

  const tree = renderer.create(<Test />);
  expect(tree).toMatchSnapshot();

  msg.emit('hello', 'hello');
  expect(tree).toMatchSnapshot();
});
