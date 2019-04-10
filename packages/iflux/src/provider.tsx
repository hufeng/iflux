import React from 'react';
import { StoreContext } from './context';
import { Store } from './store';
import { IProviderProps } from './types';
const noop = () => {};

export default class Provider<T> extends React.Component<IProviderProps<T>> {
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };
  store: Store<T>;

  constructor(props) {
    super(props);
    this.store = this.props.store();

    //debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.store.debug) {
        const { version } = require('../package.json');
        console.log(`iflux@${version}`);
        console.log('Provider enable debug mode');
        if (props.id) {
          (global || window)[props.id] = { store: this.store };
        }
      }
    }
  }

  componentDidMount() {
    this.props.onMounted && this.props.onMounted(this.store);
  }

  componentWillUnmount() {
    this.props.onWillUnmount && this.props.onWillUnmount(this.store);
  }

  render() {
    //render
    return (
      <StoreContext.Provider value={this.store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
