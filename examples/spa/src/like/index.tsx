import { Provider } from 'iflux';
import React from 'react';
import Like from './component/like';
import store from './store';

export default function LikeApp() {
  const onInit = store => {
    const count = store.bigQuery;
  };

  return (
    <Provider store={store} onMounted={}>
      <Like />
    </Provider>
  );
}
