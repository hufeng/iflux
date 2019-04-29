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
  store: Store<T>;
  _rootStore: RootStore;

  constructor(props, ctx: RootStore) {
    super(props);

    //获取当前的RootContext里面的rootStore
    this._rootStore = ctx;
    //初始化store
    this.store = this.props.store();

    //如果当前的rootContext不为空，说明绑定了全局的<Root/>
    //如果当前设置了namespace则可以将store共享给RootStore
    //将store的rootContext设置为rootContext

    if (this._rootStore instanceof RootStore && this.store.ns) {
      const namespace = this.store.ns;
      this._rootStore.addZone(namespace, this.store);
      this.store.setRootContext(ctx);
    }

    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.store.debug) {
        const { version } = require('../package.json');
        console.log(`iflux@${version}`);
        const flag = this.props.id || this.store.ns;
        if (flag) {
          (global || window)[flag] = { store: this.store };
        }
      }
    }
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted(this.store);
  }

  componentWillUnmount() {
    this.props.onWillUnmount && this.props.onWillUnmount(this.store);

    //如果当前的rootContext不为空，销毁当前的store
    if (this._rootStore instanceof RootStore && this.store.ns) {
      this._rootStore.removeZone(this.store.ns);
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
