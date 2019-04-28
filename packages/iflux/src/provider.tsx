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
  private _ctx: RootStore;

  constructor(props, ctx: RootStore) {
    super(props);
    this._ctx = ctx;
    //初始化store
    this.store = this.props.store();

    //如果当前的rootContext不为空，说明
    //绑定了全局的<Root/>
    //将store的rootContext设置为rootContext
    //见证奇迹的时刻
    if (ctx instanceof RootStore) {
      const namespace = this.store.ns;
      ctx.addZone(namespace, this.store);
      this.store.setRootContext(ctx);
    }

    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.store.debug) {
        const { version } = require('../package.json');
        const ns = this.store.ns;
        console.log(`iflux@${version}`);
        console.log(`${ns} Provider enable debug mode`);
        (global || window)[ns] = { store: this.store };
      }
    }
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted(this.store);
  }

  componentWillUnmount() {
    this.props.onWillUnmount && this.props.onWillUnmount(this.store);

    //如果当前的rootContext不为空，销毁当前的store
    //可以在store扩展参数，是不是可以不销毁
    if (this._ctx instanceof RootStore) {
      this._ctx.removeZone(this.store.ns);
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
