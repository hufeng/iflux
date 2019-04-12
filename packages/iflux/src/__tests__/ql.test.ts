import { QL } from '../ql';

test('create ql', () => {
  const callback = (hello, province, city) => {
    return hello + province + city;
  };

  const ql = QL(
    [
      //data path
      'hello',
      ['user', 'addr', 'province'],
      'user.addr.city',
      callback
    ],
    'testQL'
  );

  const meta = ql.meta();
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
