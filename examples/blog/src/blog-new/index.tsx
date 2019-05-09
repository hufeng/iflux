import { Provider } from 'iflux';
import React from 'react';
import Editor from './component/edit';
import store from './store';

export default function BlogCreate(props) {
  return (
    <Provider store={store}>
      <Editor history={props.history} />
    </Provider>
  );
}
