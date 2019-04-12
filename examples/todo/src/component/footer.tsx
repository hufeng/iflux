import { useRelax } from 'iflux';
import React from 'react';
import { Command } from '../command';
import { countQL } from '../ql';

type TRelax = { count: number; filterStatus: string };

const _getCountText = (count: number) => {
  if (count > 1) {
    return `${count} items left`;
  } else if (count === 1) {
    return '1 item left';
  } else {
    return '';
  }
};

export default function Footer() {
  const { filterStatus, count, dispatch } = useRelax<TRelax>(
    ['filterStatus', { count: countQL }],
    'Footer'
  );

  return (
    <footer className='footer'>
      <span className='todo-count'>{_getCountText(count)}</span>
      <ul className='filters'>
        <li>
          <a
            href='javascript:;'
            className={'' === filterStatus ? 'selected' : ''}
            onClick={() => dispatch(Command.CHANGE_FILTER, '')}
          >
            All
          </a>
        </li>
        <li>
          <a
            href='javascript:;'
            className={'active' === filterStatus ? 'selected' : ''}
            onClick={() => dispatch(Command.CHANGE_FILTER, 'active')}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href='javascript:;'
            className={'completed' === filterStatus ? 'selected' : ''}
            onClick={() => dispatch(Command.CHANGE_FILTER, 'completed')}
          >
            Completed
          </a>
        </li>
      </ul>
      <button
        className='clear-completed'
        onClick={() => dispatch(Command.CLEAN_COMPLETED)}
      >
        Clear completed
      </button>
    </footer>
  );
}
