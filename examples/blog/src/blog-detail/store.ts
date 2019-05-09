import { createStore } from 'iflux';

export default createStore({
  ns: 'BlogDetail',
  state: {
    title: '',
    content: ''
  }
});
