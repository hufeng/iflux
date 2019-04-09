import React, { useEffect } from 'react';
import { StoreContext } from './context';
import { IProviderProps } from './types';

export default function Provider<T = {}>(props: IProviderProps<T>) {
  const store = props.store();

  //debug log
  if (process.env.NODE_ENV !== 'production') {
    if (store.debug) {
      console.log('Provider enable debug mode');
      if (props.id) {
        (global || window)[props.id] = { store };
      }
    }
  }

  //componentDidMount
  //componentWillUnmount
  useEffect(() => {
    props.onMounted && props.onMounted(store);
    return () => props.onWillUnmount && props.onWillUnmount(store);
  }, []);

  //render
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

const noop = () => {};
Provider.defaultProps = {
  onMounted: noop,
  onWillUnmount: noop
};
