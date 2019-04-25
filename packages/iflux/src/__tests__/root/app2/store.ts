import { createStore } from '../../../store';
import * as action from './action';

export default createStore({
  ns: 'app2',
  action,
  state: {
    text: 'hello app2'
  }
});

it('app2 store', () => {});
