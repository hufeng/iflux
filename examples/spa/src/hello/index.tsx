import { Provider } from 'iflux';
import React from 'react';
import Hello from './component/hello';
import store from './store';

export default function HelloApp() {
  return (
    <Provider store={store}>
      <Hello />
    </Provider>
  );
}
