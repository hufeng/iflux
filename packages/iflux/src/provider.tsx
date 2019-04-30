import React from 'react';
import { StoreContext } from './context';
import { RootContext } from './root/context';
import { RootStore } from './root/store';
import { Store } from './store';
import { IProviderProps } from './types';
const noop = () => {};

export default class Provider<T> extends React.Component<IProviderProps<T>> {
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };

  static contextType = RootContext;
  // 当前页面的store
  store: Store<T>;
  // RootProvider中的rootStore
  rootStore: RootStore;

  constructor(props: IProviderProps<T>, ctx: RootStore) {
    super(props);

    // 获取当前的RootContext里面的rootStore
    this.rootStore = ctx;
    // 初始化store
    this.store = this.props.store();
    // 当前的namespace
    const ns = this.store.ns;

    // 如果当前的rootContext不为空，说明绑定了全局的<Root/>
    // 如果当前设置了namespace则可以将store共享给RootStore
    // 将store的rootContext设置为rootContext
    // 双向依赖
    if (this.rootStore instanceof RootStore && ns) {
      this.rootStore.addZone(ns, this.store);
      this.store.setRootContext(ctx);
    }

    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.store.debug) {
        // 为了在console中调试方便
        const flag = this.props.id || this.store.ns;
        if (flag) {
          (global || window)[flag] = { store: this.store };
        }
      }
    }
  }

  componentDidMount() {
    // 回调生命周期方法
    this.props.onMounted && this.props.onMounted(this.store);
  }

  componentWillUnmount() {
    // 回调生命周期方法
    this.props.onWillUnmount && this.props.onWillUnmount(this.store);

    //如果当前的rootContext不为空，销毁当前的store
    if (this.rootStore instanceof RootStore && this.store.ns) {
      this.rootStore.removeZone(this.store.ns);
    }
  }

  render() {
    return (
      <StoreContext.Provider value={this.store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
