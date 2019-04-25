import React from 'react';
import Provider from '../../../provider';
import Text from './component/text';
import store from './store';

export default function App3() {
  return (
    <Provider store={store}>
      <Text />
    </Provider>
  );
}

it('app3', () => {});
