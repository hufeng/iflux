import isEqual from 'fast-deep-equal';
import { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { TRelaxPath } from './types';
import { isArray, isObj, isStr } from './util';

export default function useRelax<T = {}>(
  props: TRelaxPath = [],
  name: string = ''
) {
  const store: Store = useContext(StoreContext);
  const relaxPropsMapper = reduceRelaxPropsMapper(props);
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

  //only componentDidMount && componentWillUnmount
  useEffect(() => {
    return store.subscribe(() => {
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
    });
  }, []);

  return relax;
}

/**
 * 归集属性
 * @param relaxProps
 */
function reduceRelaxPropsMapper(relaxProps: TRelaxPath) {
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
