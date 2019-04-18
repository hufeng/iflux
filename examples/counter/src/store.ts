import { createStore } from 'iflux';

export interface IState {
  count: number;
}

export default createStore<IState>({
  debug: true,
  state: {
    count: 1
  }
});
