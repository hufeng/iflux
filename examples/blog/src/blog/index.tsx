import { Provider } from 'iflux';
import React from 'react';
import List from './component/list';
import store from './store';

export default function Blog() {
  return (
    <Provider store={store}>
      <List />
    </Provider>
  );
}
