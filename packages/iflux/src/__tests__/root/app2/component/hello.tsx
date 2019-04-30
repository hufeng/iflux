import React from 'react';
import { Relax } from '../../../../relax';
import { TRelaxProps } from '../../../../types';

@Relax(['text', { text1: '@app1.text' }])
export default class Hello extends React.Component {
  relaxProps = {} as TRelaxProps<{
    text: string;
    text1: string;
  }>;

  render() {
    const { text, text1 } = this.relaxProps;
    return (
      <div>
        <div>{text}</div>
        <div>{text1}</div>
      </div>
    );
  }
}

it('hello component test', () => {});
