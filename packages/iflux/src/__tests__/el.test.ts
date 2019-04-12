import { EL } from '../el';

test('create ql', () => {
  const callback = (hello, province, city) => {
    console.log(hello, province, city);
  };

  const el = EL(
    [
      //data path
      'hello',
      ['user', 'addr', 'province'],
      'user.addr.city',
      callback
    ],
    'testQL'
  );

  const meta = el.meta();
  expect(meta).toMatchSnapshot();
  expect(meta).toEqual({
    id: 1,
    name: 'testQL',
    deps: [
      //data path
      'hello',
      ['user', 'addr', 'province'],
      'user.addr.city'
    ],
    handler: callback
  });
});
