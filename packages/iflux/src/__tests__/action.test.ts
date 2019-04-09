import { action, Store } from '../index';

const handler = (store: Store) => {
  store.setState(data => {
    data['id'] = 1;
  });
};
const hello = action('hello', handler);

it('testAction', () => {
  const { msg, handler } = hello();
  expect(msg).toEqual(msg);
  expect(handler).toEqual(handler);
});
