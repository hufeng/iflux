import { QL } from 'iflux';
import { ITodo } from './store';

export const todoQL = QL([
  'todo',
  'filterStatus',
  (todo: Array<ITodo>, filterStatus: string) => {
    if (filterStatus === '') {
      return todo;
    }
    const done = filterStatus === 'completed';
    return todo.filter(v => {
      return v.done === done;
    });
  }
]);

export const countQL = QL([
  todoQL,
  /**
   * QL支持嵌套
   */
  (todoQL: Array<ITodo>) => todoQL.length
]);
