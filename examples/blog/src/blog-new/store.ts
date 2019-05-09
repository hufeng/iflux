import { createStore } from 'iflux';

export interface IState {
  title: string;
  content: string;
}

export default createStore<IState>({
  ns: 'BlogNew',
  state: {
    title: '',
    content: ''
  }
});
