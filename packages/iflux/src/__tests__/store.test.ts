import isEqual from 'fast-deep-equal';
import action from '../action';
import { EL } from '../el';
import { QL } from '../ql';
import { createStore } from '../store';

it('test init store', () => {
  const store = createStore({
    state: {
      framework: {
        id: 1,
        name: 'iflux',
        version: '4.0.0'
      }
    }
  })();

  expect(store.getState()).toEqual({
    framework: {
      id: 1,
      name: 'iflux',
      version: '4.0.0'
    }
  });

  store.setState(state => {
    state.framework.id = 2;
    state.framework.version = '4.0.1';
  });

  expect(store.getState()).toEqual({
    framework: {
      id: 2,
      name: 'iflux',
      version: '4.0.1'
    }
  });
});

it('test store bigQuery', () => {
  const store = createStore({
    state: {
      framework: {
        id: 1,
        name: 'iflux',
        version: '4.0.0'
      }
    }
  })();

  const helloQL = QL([
    ['framework', 'id'],
    'framework.name',
    'framework.version',
    (id: number, name: string, version: string) => {
      return { id, name, version };
    }
  ]);

  const hello = store.bigQuery(helloQL);
  expect(hello).toEqual({
    id: 1,
    name: 'iflux',
    version: '4.0.0'
  });

  //nest ql
  const nestQL = QL([
    helloQL,
    'framework',
    (hello, frm) => {
      return isEqual(hello, frm);
    }
  ]);

  expect(store.bigQuery(nestQL)).toEqual(true);
});

it('test effect lang', () => {
  const nameQL = QL(['framework.name', (name: string) => name]);

  const helloEL = EL([
    'framework.id',
    nameQL,
    (id: number, name: string) => {
      expect(id).toEqual(2);
      expect(name).toEqual('iflux');
    }
  ]);

  const store = createStore({
    el: { helloEL },
    state: {
      framework: {
        id: 1,
        name: 'iflux',
        version: '4.0.0'
      }
    }
  })();

  store.setState(state => {
    state.framework.id = 2;
  });
});

it('test setState and action', () => {
  const changeState = action('changeState', store => {
    store.setState(state => {
      state.framework.id = 2;
    });
  });

  const store = createStore({
    action: { changeState },
    state: {
      framework: {
        id: 1,
        name: 'iflux',
        version: '4.0.0'
      }
    }
  })();

  store.dispatch('changeState');
  const state = store.getState();
  expect(state).toEqual({
    framework: {
      id: 2,
      name: 'iflux',
      version: '4.0.0'
    }
  });
});
