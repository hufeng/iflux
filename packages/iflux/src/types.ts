import { EffectLang } from './el';
import { QueryLang } from './ql';
import { Store } from './store';

export type TActionHandler = (store: Store<any>, param?: any) => void;

export type TPath = Array<string | number> | string | QueryLang;

export type TQLang = Array<TPath | Function>;

export type TRelaxPath = Array<
  string | number | Array<string | number> | Object
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
  ql?: { [name: string]: QueryLang };
  el?: { [name: string]: EffectLang };
  action?: { [name: string]: TActionRetFn };
}

export type TSubscriber = (data: Object) => void;

export interface IProviderProps<T> {
  children?: JSX.Element;
  store: () => Store<T>;
  onMounted?: (store: Store) => void;
  onWillUnmount?: (store: Store) => void;
  /**
   * 当前应用标记，主要用于调试
   */
  id?: string;
}
