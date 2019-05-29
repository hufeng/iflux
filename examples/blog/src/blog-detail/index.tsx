import { Provider, Store } from 'iflux';
import React from 'react';
import { IBlog } from '../blog/store';
import Blog from './component/blog';
import store from './store';

export default function BlogDetail(props: any) {
  const id = props.match.params.id;

  const onInit = (store: Store<IBlog>) => {
    const blog = store.bigQuery(['@Blog', 'list', id]) || {};
    store.setState(state => {
      state.id = blog.id;
      state.title = blog.title;
      state.content = blog.content;
    });
  };

  return (
    <Provider store={store} onMounted={onInit} onUpdate={onInit} id='Detail'>
      <Blog />
      <a href='javascript:void(0);' onClick={props.history.goBack}>
        back
      </a>
    </Provider>
  );
}
