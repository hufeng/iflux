import { action, Store } from 'iflux';
import { IBlog, IState } from './store';

export const saveBlog = action(
  'blog-new-save',
  (store: Store<IState>, params: IBlog) => {
    store.setState(state => {
      state.list = [params, ...state.list];
    });
  }
);

export default {
  saveBlog
};
