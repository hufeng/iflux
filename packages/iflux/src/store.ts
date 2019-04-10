import produce from 'immer';
import ReactDOM from 'react-dom';
import { EffectLang } from './el';
import { QueryLang } from './ql';
import {
  IStoreProps,
  TActionHandler,
  TActionRetFn,
  TPath,
  TSubscriber
} from './types';
import { getPathVal, isArray, isStr } from './util';

/**
 * 是不是可以批量处理
 * ReactDOM unstable_batchedUpdates 可以很酷的解决父子组件级联渲染的问题
 * 可惜 Preact 不支持，只能靠 Immutable 的不可变这个特性来挡着了
 * 在 react-native 环境中，unstable_batchedUpdates 是在 react-native 对象中
 * 所以我们的 babel-plugin-plume2 就是去解决这个问题
 */
const batchedUpdates =
  ReactDOM.unstable_batchedUpdates ||
  function(cb: Function) {
    cb();
  };

/**
 * state container
 */
export class Store<T = any> {
  public debug: boolean;
  private _state: T;
  private _subscribe: Array<TSubscriber>;
  private _el: Array<Function>;
  private _cache: { [key: number]: Array<any> };
  private _action: { [name: string]: TActionHandler };

  constructor(props: IStoreProps<T>) {
    const { debug, state = {}, el = {}, action = {} } = props;

    this._cache = {};
    this._subscribe = [];

    this.debug = debug || false;
    if (process.env.NODE_ENV != 'production') {
      if (this.debug) {
        const { version } = require('../package.json');
        console.log(`iflux@${version}`);
      }
    }

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
  }): { [name: string]: TActionHandler } {
    return Object.keys(actions).reduce((r, key) => {
      const action = actions[key];
      const { msg, handler } = action();
      r[msg] = handler;
      return r;
    }, {});
  }

  dispatch = (action: string, params?: Object) => {
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

  getState() {
    return Object.freeze(this._state);
  }

  setState = (callback: (data: T) => void) => {
    const state = produce(this._state, callback as any);
    if (state !== this._state) {
      this._state = state as T;
      this._computeEL();

      //update ui
      batchedUpdates(() => {
        for (let subscribe of this._subscribe) {
          subscribe(this._state);
        }
      });
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

  subscribe = (callback: TSubscriber) => {
    let index = this._subscribe.indexOf(callback);
    if (index === -1) {
      this._subscribe.push(callback);
    }

    return () => {
      let index = this._subscribe.indexOf(callback);
      if (index !== -1) {
        this._subscribe.splice(index, 1);
      }
    };
  };

  //=====================debug===========================
  pprint() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(this._state, null, 2));
    }
  }
}

//factory method
//avoid singleton
export function createStore<T>(props: IStoreProps<T>) {
  return () => new Store<T>(props);
}
