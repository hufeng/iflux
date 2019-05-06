import React from 'react';
import { IRootProviderProps } from '../types';
import { RootContext } from './context';
import { createRootStore, RootStore } from './store';
const noop = () => {};

/**
 * Root Provider
 * 顶层的Provider，主要为了解决跨页面数据共享和更新的问题
 *
 * <RootProvider store={createRootStore({})}/>
 */
export default class RootProvider extends React.Component<IRootProviderProps> {
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };

  store: RootStore;

  constructor(props: IRootProviderProps) {
    super(props);

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
        (global || window)['Root'] = { store: this.store };
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
