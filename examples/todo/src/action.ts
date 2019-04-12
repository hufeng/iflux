import { action, Store } from 'iflux';
import { Command } from './command';
import { IState } from './store';
import * as webapi from './webapi';

export const onInit = action(Command.INIT, (store: Store<IState>) => {
  webapi.fetchTodos().then(todos => {
    store.setState(data => {
      data.todo = todos;
    });
  });
});

export const toggleAll = action(Command.TOGGLE_ALL, (store: Store<IState>) => {
  store.setState(data => {
    data.todo.forEach(item => {
      item.done = !item.done;
    });
  });
});

export const toggleOne = action(
  Command.TOGGLE,
  (store: Store<IState>, index: number) => {
    store.setState(data => {
      const done = data.todo[index].done;
      data.todo[index].done = !done;
    });
  }
);

export const destroy = action(
  Command.DESTROY,
  (store: Store<IState>, index: number) => {
    store.setState(data => {
      data.todo = data.todo.filter((_v, k) => k !== index);
    });
  }
);

export const changeText = action(
  Command.CHANGE_TEXT,
  (store: Store<IState>, text: string) => {
    store.setState(data => {
      data.value = text;
    });
  }
);

let id = 100;
export const submit = action(Command.SUMBIT_TEXT, (store: Store<IState>) => {
  store.setState(data => {
    //add todo
    data.todo.push({
      id: ++id,
      text: data.value,
      done: false
    });

    //clear
    data.value = '';
  });
});

export const changeFilter = action(
  Command.CHANGE_FILTER,
  (store: Store<IState>, filter: string) => {
    store.setState(data => {
      data.filterStatus = filter;
    });
  }
);

export const clearCompleted = action(
  Command.CLEAN_COMPLETED,
  (store: Store<IState>) => {
    store.setState(data => {
      data.todo = data.todo.filter(item => !item.done);
    });
  }
);
