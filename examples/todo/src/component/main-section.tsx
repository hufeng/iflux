import { useRelax } from 'iflux';
import React from 'react';
import { Command } from '../command';
import { ITodo } from '../store';

type TRelax = { todoQL: Array<ITodo> };

export default function MainSection() {
  const { todoQL, dispatch } = useRelax<TRelax>(['todoQL']);

  return (
    <section className='main'>
      <input
        className='toggle-all'
        type='checkbox'
        onChange={() => dispatch(Command.TOGGLE_ALL)}
      />
      <label htmlFor='toggle-all'>Mark all as complete</label>
      <ul className='todo-list'>
        {todoQL.map((v, k) => (
          <li key={v.id}>
            <div className='view'>
              <input
                className='toggle'
                type='checkbox'
                checked={v.done}
                onChange={() => dispatch(Command.TOGGLE, k)}
              />
              <label>{v.text}</label>
              <button
                className='destroy'
                onClick={() => dispatch(Command.DESTROY, k)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
