import { ITodo } from './store';

export const fetchTodos = (): Promise<Array<ITodo>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'hello javascript', done: true },
        { id: 2, text: 'hello typescript', done: true },
        { id: 3, text: 'hello clojure', done: false },
        { id: 4, text: 'hello resonml', done: false },
        { id: 5, text: 'hello ocaml', done: false }
      ]);
    }, 200);
  });
};
