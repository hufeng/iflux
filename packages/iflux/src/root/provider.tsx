import React from 'react';
import { IRootProviderProps } from '../types';
import { RootContext } from './context';
import { createRootStore, RootStore } from './store';
const noop = () => {};

/**
 * Root Provider
 * 顶层的Provider，主要为了解决跨页面数据共享和更新的问题
 * 随着Provider的加载，渐进式的将Page中的store归集到RootStore中
 *
 * Usage:
 * // 缺省store
 * <RootProvider />
 *
 * // 设置rootStore
 * <RootProvider store={createRootStore({state: {}})}/>
 */
export default class RootProvider extends React.Component<IRootProviderProps> {
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };

  store: RootStore;

  constructor(props: IRootProviderProps) {
    super(props);

    // 如果对当前props没有store，就创建一个默认的
    if (this.props.store) {
      this.store = this.props.store();
    } else {
      this.store = createRootStore({ state: {} })();
    }

    // set debug
    this.store.debug = this.props.debug || false;

    // debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.debug) {
        console.log('RootProvider enable debug mode');
        // 方便在console中定位问题
        (global || window)['RootStore'] = this.store;
      }
    }
  }

  componentDidMount() {
    // 回调生命周期
    this.props.onMounted && this.props.onMounted(this.store);
  }

  componentWillUnmount() {
    // 回调生命周期
    this.props.onWillUnmount && this.props.onWillUnmount(this.store);
  }

  render() {
    return (
      <RootContext.Provider value={this.store}>
        {this.props.children}
      </RootContext.Provider>
    );
  }
}
