import React from 'react';
import { useRelax } from '../../../../relax';

export default function Text() {
  const { text, setState, dispatch } = useRelax(['text']);

  const dec = () =>
    setState(state => {
      state.text = state.text + ' dec';
    });

  global['dispatchApp1'] = () => dispatch('inc');

  return (
    <div>
      <a href='javascript:void(0);' onClick={dec}>
        dec
      </a>
      <div>{text}</div>
      <a href='javascript:void(0);' onClick={() => dispatch('inc')}>
        inc
      </a>
    </div>
  );
}

it('app1 text', () => {});
