import isEqual from 'fast-deep-equal';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { TRelaxPath } from './types';
import { isArray, isObj, isStr } from './util';

/**
 * 获取数据从当前的store获取，因为当前的store会获取rootContext
 * 然后获取各个namespace下的参数
 *
 * 更新时候单独监听每个other store，做增量更新
 */

export function useRelax<T = {}>(props: TRelaxPath = [], name: string = '') {
  //获取当前的store的上下文
  const store: Store = useContext(StoreContext);
  const relaxPropsMapper = reduceRelaxPropsMapper(props);
  const namespaces = reduceRelaxNamespaceProps(relaxPropsMapper);
  const relaxData = computeRelaxProps<T>(store, relaxPropsMapper);
  const [relax, updateState] = useState(relaxData);

  //get last relax state
  const preRelax = useRef(null);
  useEffect(() => {
    //@ts-ignore
    preRelax.current = relax;
  });

  if (process.env.NODE_ENV !== 'production') {
    if (store.debug && name && !preRelax.current) {
      //@ts-ignore
      const { setState, dispatch, ...rest } = relax;
      console.log(`Relax(${name}):`, rest);
    }
  }

  const updateRelax = (store: Store) => () => {
    const newState = computeRelaxProps<T>(store, relaxPropsMapper);
    if (!isEqual(newState, preRelax.current)) {
      if (process.env.NODE_ENV !== 'production') {
        if (store.debug && name) {
          //@ts-ignore
          const { setState, dispatch, ...rest } = newState;
          console.log(`Relax(${name})-update:`, rest);
        }
      }
      updateState(newState);
    }
  };

  //only componentDidMount && componentWillUnmount
  useEffect(() => {
    if (!isRx(props)) {
      return noop;
    }
    // 获取当前的root上下文
    const rootContext = store.getRootContext();
    if (rootContext) {
      const { ns } = store;
      const allNamespaces = [ns, ...namespaces];
      const unsubscribeArr = allNamespaces.map(ns => {
        const _store = rootContext.zoneMapper[ns];
        return _store.subscribe(updateRelax(store));
      });
      return () => {
        for (let unsubscribe of unsubscribeArr) {
          unsubscribe();
        }
      };
    } else {
      return store.subscribe(updateRelax(store));
    }
  }, []);

  return relax;
}

///======================relax class=========================================
export function Relax(relaxProps: TRelaxPath): any {
  return function wrapper(Wrapper: React.ComponentClass) {
    return class RelaxWrapper extends Wrapper {
      static contextType = StoreContext;
      static displayName = `Relax(${Wrapper.name})`;
      static defaultProps = Wrapper.defaultProps || {};

      relaxProps: Object;

      _store: Store;
      _isMounted: boolean;
      _relaxPropsMapper: {
        [name: string]: Array<string | number> | string;
      };
      _isRx: boolean;
      _unsubscirbe: Function;
      _ns: Array<string>;

      constructor(props: Object, ctx) {
        super(props);
        this._store = ctx;
        this._isMounted = false;

        this._relaxPropsMapper = reduceRelaxPropsMapper(relaxProps);
        this._ns = reduceRelaxNamespaceProps(this._relaxPropsMapper);
        this.relaxProps = computeRelaxProps(
          this._store,
          this._relaxPropsMapper
        );

        this._isRx = isRx(relaxProps);
        this._unsubscirbe = noop;
        if (this._isRx) {
          this._unsubscirbe = this._store.subscribe(this._handleRx);
        }
      }

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        this._isMounted = true;
      }

      shouldComponentUpdate(
        nextProps: Object,
        nextState: Object,
        nextContext: Object
      ) {
        if (super.shouldComponentUpdate) {
          return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        }

        if (!isEqual(nextProps, this.props)) {
          return true;
        }

        if (!isEqual(nextState, this.state)) {
          //重新计算
          this.relaxProps = computeRelaxProps(
            this._store,
            this._relaxPropsMapper
          );
          return true;
        }

        return false;
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount();
        this._isMounted = false;
        this._unsubscirbe();
      }

      _handleRx = (ns: string, state: Object) => {
        const isMounted = this._isMounted;
        //过滤namespace
        const isBelongToNS =
          ns === this._store.ns || this._ns.indexOf(ns) !== -1;

        if (isMounted && isBelongToNS) {
          this.setState({
            storeState: state
          });
        }
      };
    };
  };
}

/**
 * 获取所有的命名空间
 */
function reduceRelaxNamespaceProps(relaxProps: {
  [name: string]: Array<string | number> | string;
}) {
  let namespaces = [] as Array<string>;

  for (let name in relaxProps) {
    if (relaxProps.hasOwnProperty(name)) {
      const path = relaxProps[name];
      const ns = path[0] as string;
      if (ns.indexOf('@') === 0) {
        namespaces.push(ns.replace('@', ''));
      }
    }
  }

  return namespaces;
}

function isRx(relaxProps: Array<any> = []) {
  return relaxProps.length !== 0;
}

/**
 * 归集属性
 * @param relaxProps
 */
function reduceRelaxPropsMapper(relaxProps: TRelaxPath = []) {
  const relaxPathMapper = {};

  for (let prop of relaxProps) {
    //如果当前的属性是数组
    //默认去最后一个字段的名称作为key
    //如果最后一位是数字，建议使用对象的方式
    if (isArray(prop)) {
      const len = prop.length;
      const last = prop[len - 1];
      relaxPathMapper[last] = prop;
    }
    //如果是字符串就直接以字符串作为key
    //如果是list.0.id这样的字符串就
    //先分割，然后走array一样的流程
    else if (isStr(prop)) {
      if (prop.indexOf('.') != -1) {
        const arr = prop.split('.');
        const len = arr.length;
        const last = arr[len - 1];
        relaxPathMapper[last] = arr;
      } else {
        relaxPathMapper[prop] = prop;
      }
    }
    //如果是对象
    else if (isObj(prop)) {
      Object.keys(prop).forEach(key => {
        let val = prop[key];
        if (isStr(val) && val.indexOf('.') != -1) {
          val = val.split('.');
        }
        relaxPathMapper[key] = val;
      });
    }
  }

  return relaxPathMapper;
}

/**
 * 计算relax路径对应的值
 * @param store
 * @param mapper
 */
function computeRelaxProps<T>(
  store: Store,
  mapper: { [name: string]: Array<string | number> | string }
) {
  const relaxData = {
    dispatch: store.dispatch,
    setState: store.setState
  };

  for (let prop in mapper) {
    if (mapper.hasOwnProperty(prop)) {
      const val = mapper[prop];
      relaxData[prop] = store.bigQuery(val);
    }
  }

  return relaxData as T & {
    dispatch: typeof store.dispatch;
    setState: typeof store.setState;
  };
}

function noop() {}
