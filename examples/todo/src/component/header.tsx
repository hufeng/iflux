import { useRelax } from 'iflux';
import React from 'react';
import { Command } from '../command';
type TRelax = { value: string };

export default function Header() {
  const { value, dispatch } = useRelax<TRelax>(['value'], 'header');

  const _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      dispatch(Command.SUMBIT_TEXT);
    }
  };

  return (
    <header className='header'>
      <h1>todos </h1>
      <input
        value={value}
        className='new-todo'
        onKeyDown={_handleKeyDown}
        onChange={e => dispatch(Command.CHANGE_TEXT, (e.target as any).value)}
        placeholder='What needs to be done?'
        autoFocus
      />
    </header>
  );
}
