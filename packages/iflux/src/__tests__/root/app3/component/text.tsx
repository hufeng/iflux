import React from 'react';
import { useRelax } from '../../../../relax';

export default function Text() {
  const { text, text2, setState, dispatch } = useRelax([
    'text',
    { text2: '@app2.text' }
  ]);

  const dec = () =>
    setState(state => {
      state.text = state.text + ' dec';
    });

  return (
    <div>
      <a href='javascript:void(0);' onClick={dec}>
        dec
      </a>
      <div>{text} </div>
      <div>{text2}</div>
      <a href='javascript:void(0);' onClick={() => dispatch('inc')}>
        inc
      </a>
    </div>
  );
}
it('app3 text', () => {});
