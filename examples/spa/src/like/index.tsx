import { Provider } from 'iflux';
import React from 'react';
import Like from './component/like';
import store from './store';

export default function LikeApp() {
  return (
    <Provider store={store} id='LikeApp'>
      <Like />
    </Provider>
  );
}
