import React from 'react';
import { useRelax } from '../../../../relax';

export default function Text() {
  const { text, dispatch } = useRelax(['text']);

  global['dispatchApp1'] = () => dispatch('inc');

  return (
    <div>
      <div>{text}</div>
    </div>
  );
}

it('app1 text', () => {});
