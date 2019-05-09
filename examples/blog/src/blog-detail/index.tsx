import { Provider, Store } from 'iflux';
import React from 'react';
import { IBlog } from '../blog/store';
import Blog from './component/blog';
import store from './store';

export default function BlogDetail(props: any) {
  const id = props.match.params.id;

  const onInit = (store: Store<IBlog>) => {
    store.setState(state => {
      state.id = 1;
      state.title = 'hello world';
      state.content = 'hello';
    });
    console.log(store.getState());
  };

  return (
    <Provider store={store} onMounted={onInit} debug id='Detail'>
      <Blog />
      <a href='javascript:void(0);' onClick={() => props.history.goBack()}>
        back
      </a>
    </Provider>
  );
}
