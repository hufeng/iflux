import { createStore } from 'iflux';
import * as action from './action';

export default createStore({
  ns: 'like',
  action,
  state: {
    like: 0
  }
});
