import { useRelax } from 'iflux';
import React from 'react';
import { Command } from '../command';

type TRelax = { countQL: number; filterStatus: string };

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
  const { filterStatus, countQL, dispatch } = useRelax<TRelax>(
    ['count', 'filterStatus'],
    'Footer'
  );

  return (
    <footer className='footer'>
      <span className='todo-count'>{_getCountText(countQL)}</span>
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
            href='javacript:;'
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
