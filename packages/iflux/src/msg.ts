import mitt from 'mitt';
import { useEffect } from 'react';

export type TMsgListeners = { [name: string]: mitt.Handler };

export const msg = new mitt();

export function useMsg(listener: TMsgListeners = {}) {
  //componentDidMount
  useEffect(() => {
    const keys = Object.keys(listener);

    for (let key of keys) {
      msg.on(key, listener[key]);
    }

    //componentWillUnmount
    return () => {
      for (let key of keys) {
        msg.off(key, listener[key]);
      }
    };
  }, []);

  return msg;
}
