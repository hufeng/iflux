import mitt from 'mitt';
import { useEffect } from 'react';

export type TMsgListeners = Array<{ name: string; handler: mitt.Handler }>;

export const msg: mitt.Emitter = new mitt();

export function useMsg(listeners: TMsgListeners = []) {
  useEffect(() => {
    for (let { name, handler } of listeners) {
      msg.on(name, handler);
    }
    return () => {
      for (let { name, handler } of listeners) {
        msg.off(name, handler);
      }
    };
  }, []);

  return msg;
}
