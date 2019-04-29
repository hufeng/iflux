import { EffectLang } from './el';
import { QueryLang } from './ql';
import { RootStore } from './root/store';
import { Store } from './store';

export type TActionHandler = (store: Store<any>, param?: any) => void;
export type TRootActionHandler = (store: RootStore<any>, params?: any) => void;

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export type TRelaxPath = Array<
  string | number | Array<string | number> | Object | QueryLang
>;

export interface IQLangProps {
  name: string;
  lang: TQLang;
}

export type TActionRetFn = () => { msg: string; handler: TActionHandler };

export type TAction = (msg: string, handler: TActionHandler) => TActionRetFn;

export interface IStoreProps<T = {}> {
  /**
   * 当前store的命名空间, 如果设置，将会把当前store共享给<Root/>
   */
  ns?: string;

  /**
   * 当前store的debug状态， 默认false
   */
  debug?: boolean;

  /**
   * 当前store的状态，必填
   */
  state?: T;

  /**
   * 当前store的effectlang
   */
  el?: { [name: string]: EffectLang };

  /**
   * 当前store的action
   */
  action?: { [name: string]: TActionRetFn };
}

export interface IRootStoreProps<T = {}> {
  /**
   * 当前store的debug状态， 默认false
   */
  debug?: boolean;

  /**
   * 当前store的状态，必填
   */
  state?: T;

  /**
   * 当前store的effectlang
   */
  el?: { [name: string]: EffectLang };

  /**
   * 当前store的action
   */
  action?: { [name: string]: TActionRetFn };
}

export type TSubscriber = (data: Object) => void;

export interface IProviderProps<T> {
  children?: any;
  store: () => Store<T>;
  onMounted?: (store: Store) => void;
  onWillUnmount?: (store: Store) => void;
  /**
   * 当前应用标记，主要用于调试
   */
  id?: string;
}

export interface IRootProviderProps {
  children?: any;
  store: () => RootStore<any>;
  onMounted?: (store: RootStore) => void;
  onWillUnmount?: (store: RootStore) => void;
}

export type TRelaxProps<T> = T & {
  setState(cb: (state: Object) => void): void;
  dispatch(msg: string, params?: any): void;
};
