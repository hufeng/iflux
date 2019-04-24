import produce from 'immer';
import { EffectLang } from '../el';
import { QueryLang } from '../ql';
import { Store } from '../store';
import {
  IRootStoreProps,
  IStoreProps,
  TActionRetFn,
  TPath,
  TRootActionHandler
} from '../types';
import { getPathVal, isArray, isStr } from '../util';

/**
 *  Root state container
 */
export class RootStore<T = any> {
  public debug: boolean;
  private _state: T;
  private _el: Array<Function>;
  private _cache: { [key: number]: Array<any> };
  private _action: { [name: string]: TRootActionHandler };
  private _zoneMapper: { [name: string]: Store };

  constructor(props: IRootStoreProps<T>) {
    const { debug, state = {}, el = {}, action = {} } = props;

    this._cache = {};
    this._zoneMapper = {};

    this.debug = debug || false;
    this._state = state as T;
    this._el = this._transformEl(el);
    this._action = this._reduceAction(action);
  }

  private _parseEL = (el: EffectLang) => {
    const cache = [] as Array<any>;
    const { name, handler, deps } = el.meta();

    for (let dep of deps) {
      cache.push(this.bigQuery(dep));
    }

    return () => {
      let isChanged = false;
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug && name) {
          console.groupCollapsed(`EL(${name}): debug mode`);
        }
      }

      deps.forEach((dep, i) => {
        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            console.log(`deps-> ${dep instanceof QueryLang ? 'QL' : dep}`);
          }
        }

        const val = this.bigQuery(dep);
        if (val !== cache[i]) {
          //debug log
          if (process.env.NODE_ENV !== 'production') {
            if (this.debug && name) {
              console.log('val: changed(Y)');
            }
          }
          isChanged = true;
          cache[i] = val;
        } else {
          //debug log
          if (process.env.NODE_ENV !== 'production') {
            if (this.debug && name) {
              console.log('val: changed(N)');
            }
          }
        }
      });

      if (isChanged) {
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            console.log('deps val was changed. trigger once');
            console.groupEnd();
          }
        }
        handler(...cache);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            console.log('deps val was not changed.');
            console.groupEnd();
          }
        }
      }
    };
  };

  private _transformEl = (el: { [key: string]: EffectLang }) => {
    return Object.keys(el).map(k => {
      const val = el[k];
      return this._parseEL(val);
    });
  };

  private _computeEL = () => {
    for (let handle of this._el) {
      handle();
    }
  };

  private _reduceAction(actions: {
    [name: string]: TActionRetFn;
  }): { [name: string]: TRootActionHandler } {
    return Object.keys(actions).reduce((r, key) => {
      const action = actions[key];
      const { msg, handler } = action();
      r[msg] = handler;
      return r;
    }, {});
  }

  dispatch = (action: string, params?: any) => {
    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.debug) {
        console.groupCollapsed(`dispath:-> ${action}`);
        console.log('params->', params);
      }
    }

    const handler = this._action[action];
    if (!handler) {
      //debug
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug) {
          console.warn(
            `Oops, Could not find any handler. Please check you action`
          );
        }
      }
      return;
    }

    //debug
    if (process.env.NODE_ENV !== 'production') {
      if (this.debug) {
        console.log(`Action(${action}) received`);
        console.groupEnd();
      }
    }

    handler(this, params);
  };

  dispatchGlobal = (msg: string, params?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      if (this.debug) {
        console.log(`dispatch global msg -> ${msg}`);
        console.log('params->', params);
      }
    }

    //dispatch root
    const handler = this._action[msg];
    if (handler) {
      //debug log
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug) {
          console.log(`Root: handle -> ${msg} `);
        }
      }

      handler(this, params);
    }

    for (let namespace in this._zoneMapper) {
      if (this._zoneMapper.hasOwnProperty(namespace)) {
        const store = this._zoneMapper[namespace];
        const handler = store.getAction()[msg];

        if (handler) {
          //debug log
          if (process.env.NODE_ENV !== 'production') {
            if (this.debug) {
              console.log(`Root: handle -> ${msg} `);
            }
          }

          handler(store, params);
        }
      }
    }
  };

  getState() {
    return Object.freeze(this._state);
  }

  setState = (callback: (data: T) => void) => {
    const state = produce(this._state, callback as any);
    if (state !== this._state) {
      this._state = state as T;
      this._computeEL();

      //通知所有的relax告诉大家root的state更新拉
      //relax会根据注入的属性判断是不是需要更新
      for (let namespace in this._zoneMapper) {
        if (this._zoneMapper.hasOwnProperty(namespace)) {
          this._zoneMapper[namespace].notifyRelax('root');
        }
      }
    }
  };

  bigQuery = (query: TPath | QueryLang) => {
    if (isStr(query) || isArray(query)) {
      return getPathVal(this._state, query);
    } else if (query instanceof QueryLang) {
      let isChanged = false;
      const { id, deps, name, handler } = query.meta();

      //init cache
      this._cache[id] || (this._cache[id] = []);
      const len = deps.length;

      //debug log
      if (process.env.NODE_ENV !== 'production') {
        if (this.debug && name) {
          console.groupCollapsed(`BigQuery(${name}):|>`);
        }
      }

      //计算pathVal
      deps.forEach((dep, i) => {
        const val = this.bigQuery(dep);
        if (val !== this._cache[id][i]) {
          isChanged = true;
        }

        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            const name =
              dep instanceof QueryLang ? `QL(${dep.meta.name})` : dep;
            console.log('dep ->', name);
            console.log('val ->', val);
          }
        }

        this._cache[id][i] = val;
      });

      if (isChanged) {
        const depVal = this._cache[id].slice(0, len);
        const result = handler(...depVal);
        this._cache[id][len] = result;

        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            console.log(`result: isChanged->Y`);
            console.log('val->', result);
            console.groupEnd();
          }
        }

        return result;
      } else {
        //debug log
        if (process.env.NODE_ENV !== 'production') {
          if (this.debug && name) {
            console.log(`result: isChanged->N`);
            console.log('val->', this._cache[id][len]);
            console.groupEnd();
          }
        }

        return this._cache[id][len];
      }
    }
  };

  setZoneMapper(namespace: string, store: Store) {
    this._zoneMapper[namespace] = store;
    store.subscribe(() => {
      for (let ns in this._zoneMapper) {
        if (this._zoneMapper.hasOwnProperty(ns)) {
          if (ns !== namespace) {
            this._zoneMapper[ns].notifyRelax();
          }
        }
      }
    });
  }

  removeZoneMapper(namespace: string) {
    delete this._zoneMapper[namespace];
  }

  getZoneMapper() {
    return this._zoneMapper;
  }

  //=====================debug===========================
  pprint() {
    if (process.env.NODE_ENV !== 'production') {
      const state = { root: this.getState() };
      for (let namespace in this._zoneMapper) {
        if (this._zoneMapper.hasOwnProperty(namespace)) {
          state[namespace] = this._zoneMapper[namespace].getState();
        }
      }

      console.log(JSON.stringify(state, null, 2));
    }
  }

  pprintAction() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(Object.keys(this._action), null, 2));
    }
  }
}

//factory method
//avoid singleton
export function createRootStore<T>(props: IStoreProps<T>) {
  return () => new RootStore<T>(props);
}
