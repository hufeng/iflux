import { createStore } from 'iflux';
import * as action from './action';
import * as ql from './ql';

export interface ITodo {
  id: number;
  text: string;
  done: boolean;
}

export interface IState {
  filterStatus: string;
  value: string;
  todo: Array<ITodo>;
}

export default createStore<IState>({
  ql,
  action,
  state: {
    filterStatus: '',
    value: '',
    todo: []
  }
});
