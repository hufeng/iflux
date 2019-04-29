import action from '../../../action';

export const inc = action('inc', store => {
  store.setState(state => {
    state.text = state.text + ' inc';
  });
});

it('action', () => {});
