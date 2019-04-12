import { TActionHandler } from './types';

/**
 * simple wrapper action handler
 * @param msg
 * @param handler
 */
export default function action(msg: string, handler: TActionHandler) {
  return () => ({
    msg,
    handler
  });
}
