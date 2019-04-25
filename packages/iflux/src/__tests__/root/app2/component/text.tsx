import React from 'react';
import { useRelax } from '../../../../relax';

export default function Text() {
  const { text, text1, setState, dispatch } = useRelax([
    'text',
    { text1: '@app1.text' }
  ]);

  const dec = () =>
    setState(state => {
      state.text = state.text + ' dec';
    });

  global['dispatchApp2'] = () => dispatch('inc');

  global['dispatchApp2Global'] = () => dispatch('inc', null, true);

  return (
    <div>
      <a href='javascript:void(0);' onClick={dec}>
        dec
      </a>
      <div>{text}</div>
      <div>{text1}</div>
      <a href='javascript:void(0);' onClick={() => dispatch('inc')}>
        inc
      </a>
    </div>
  );
}
it('Text', () => {});
