import { createStore } from '../../../store';

export default createStore({
  debug: true,
  ns: 'app3',
  state: {
    text: 'hello app3'
  }
});

it('app3 createStore', () => {});
