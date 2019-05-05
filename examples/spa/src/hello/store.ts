import { createStore } from 'iflux';

export default createStore({
  ns: 'hello',
  state: {
    text: '你一抹😊如茉莉!'
  }
});
