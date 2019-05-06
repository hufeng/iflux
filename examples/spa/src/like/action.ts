import { action } from 'iflux';
import { Command } from './command';

export const inc = action(Command.INCREMENT, store => {
  store.setState(state => {
    state.like++;
  });
});
