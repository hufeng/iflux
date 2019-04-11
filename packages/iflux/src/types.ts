import { EffectLang } from './el';
import { QueryLang } from './ql';
import { Store } from './store';

export type TActionHandler = (store: Store<any>, param?: any) => void;

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
  debug?: boolean;
  state?: T;
  el?: { [name: string]: EffectLang };
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

export type TRelaxProps<T> = T & {
  setState(cb: (state: Object) => void): void;
  dispatch(msg: string, params?: any): void;
};
