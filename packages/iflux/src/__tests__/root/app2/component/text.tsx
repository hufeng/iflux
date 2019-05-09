import React from 'react';
import { useRelax } from '../../../../relax';

export default function Text() {
  const { text, text1, dispatch } = useRelax(['text', { text1: '@app1.text' }]);

  global['dispatchApp2'] = () => dispatch('inc');

  global['dispatchApp2Global'] = () => dispatch('inc', null, true);

  return (
    <div>
      <div>{text}</div>
      <div>{text1}</div>
    </div>
  );
}
it('Text', () => {});
