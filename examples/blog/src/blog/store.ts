import { createStore } from 'iflux';
import action from './action';

export interface IBlog {
  id: number;
  title: string;
  content: string;
}

export interface IState {
  list: Array<IBlog>;
}

export default createStore<IState>({
  ns: 'Blog',
  action,
  state: {
    list: []
  }
});
