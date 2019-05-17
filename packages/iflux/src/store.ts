import produce from 'immer';
import ReactDOM from 'react-dom';
import { EffectLang } from './el';
import { QueryLang } from './ql';
import { RootStore } from './root/store';
import {
  IStoreProps,
  TActionHandler,
  TActionRetFn,
  TPath,
  TSubscriber
} from './types';
import {
  getPathVal,
  isArray,
  isContextPathVal,
  isFn,
  isStr,
  parseContextPathVal
} from './util';

/**
 * 是不是可以批量处理
 * ReactDOM unstable_batchedUpdates 可以很酷的解决父子组件级联渲染的问题
 * 可惜 Preact 不支持，只能靠 Immutable 的不可变这个特性来挡着了
 * 在 react-native 环境中，unstable_batchedUpdates 是在 react-native 对象中
 * 如果是小程序，直接使用babel-plugin-iflux抹掉
 * 所以我们的 babel-plugin-iflux 就是去解决这个问题
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
  //当前的debug状态
  public debug: boolean;
  //当前store的命名空间
  //如果设置了namespace，则在<Root/>上下文的情况下
  //store会自动共享给RootContext的store
  public ns: string | null;
  public destroyAtUnmounted: boolean;

  //当前的状态
  private _state: T;
  //当前的effect lang
  private _el: Array<Function>;
  //当前的root上下文，如果没有<Root/>
  //则为null
  private _rootContext: RootStore | null;
  //当前store变化的订阅者
  private _subscribe: Array<TSubscriber>;
  //bigQuery的cache缓存
  private _cache: { [key: number]: Array<any> };
  //当前的action
  private _action: { [name: string]: TActionHandler };

  constructor(props: IStoreProps<T>) {
    const {
      state = {},
      el = {},
      action = {},
      ns = null,
      destroyAtUnmounted = false
    } = props;

    this._cache = {};
    this._subscribe = [];

    this.ns = ns;
    this._rootContext = null;
    this.debug = false;
    this.destroyAtUnmounted = destroyAtUnmounted || false;
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
      // 如果当前的值不是函数，提前返回
      // 主要在用parcel build的时候
      // import * as action from './action'
      // action 常常会带一个 _esModule: true
      if (!isFn(action)) {
        return r;
      }
      const { msg, handler } = action();
      r[msg] = handler;
      return r;
    }, {});
  }

  dispatch = (action: string, params?: Object, isGlobal: boolean = false) => {
    //global dispatch
    if (isGlobal) {
      if (this._rootContext != null) {
        this._rootContext.dispatchGlobal(action, params);
      } else {
        if (process.env.NODE_ENV != 'production') {
          console.warn(
            `Oops, global dispatch action -> ${action} params -> ${JSON.stringify(
              params
            )}, Could not find any RootContext`
          );
        }
      }
      return;
    }

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
    const newState = produce(this._state, callback as any);
    if (newState !== this._state) {
      this._state = newState as T;

      //update ui
      this.notifyRelax();
      //更新当前el
      this._computeEL();
    }
  };

  notifyRelax = () => {
    //update ui
    batchedUpdates(() => {
      for (let subscribe of this._subscribe) {
        subscribe(this._state);
      }
    });
  };

  bigQuery = (query: TPath | QueryLang) => {
    //如果当前是上下文的路径变量
    if (isContextPathVal(query)) {
      //解析上下文 , 如{namespace: 'goods', ['addr', 'province']}
      const { namespace, path } = parseContextPathVal(query);
      if (this._rootContext) {
        if (namespace === 'root') {
          return getPathVal(this._rootContext.getState(), path);
        } else {
          const store = this._rootContext.zoneMapper[namespace] as Store;
          if (store) {
            return getPathVal(store.getState(), path);
          } else {
            return undefined;
          }
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Cound not find namespace -> '${namespace}' path -> '${path}', You should set <Root/> and namespace`
          );
        }
        return;
      }
    } else if (isStr(query) || isArray(query)) {
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

  setRootContext(context: RootStore) {
    this._rootContext = context;
  }

  getRootContext() {
    return this._rootContext;
  }

  getAction() {
    return this._action;
  }

  //=====================debug===========================
  pprint() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(this._state, null, 2));
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
export function createStore<T>(props: IStoreProps<T>) {
  return () => new Store<T>(props);
}
