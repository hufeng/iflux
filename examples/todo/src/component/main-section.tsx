import { useRelax } from 'iflux';
import React from 'react';
import { Command } from '../command';
import { todoQL } from '../ql';
import { ITodo } from '../store';
type TRelax = { todo: Array<ITodo> };

export default function MainSection() {
  const { todo, dispatch } = useRelax<TRelax>(
    [{ todo: todoQL }],
    'MainSection'
  );

  return (
    <section className='main'>
      <input
        className='toggle-all'
        type='checkbox'
        onChange={() => dispatch(Command.TOGGLE_ALL)}
      />
      <label htmlFor='toggle-all'>Mark all as complete</label>
      <ul className='todo-list'>
        {todo.map(v => (
          <li key={v.id}>
            <div className='view'>
              <input
                className='toggle'
                type='checkbox'
                checked={v.done}
                onChange={() => dispatch(Command.TOGGLE, v.id)}
              />
              <label>{v.text}</label>
              <button
                className='destroy'
                onClick={() => dispatch(Command.DESTROY, v.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
