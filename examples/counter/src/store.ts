import { createStore } from 'iflux';

export interface IState {
  count: number;
}

export default createStore<IState>({
  state: {
    count: 1
  }
});
