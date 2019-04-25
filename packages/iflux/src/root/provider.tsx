import React from 'react';
import { IRootProviderProps } from '../types';
import { RootContext } from './context';
import { RootStore } from './store';
const noop = () => {};

/**
 * Root Provider
 */
export default class RootProvider extends React.Component<IRootProviderProps> {
  static defaultProps = {
    onMounted: noop,
    onWillUnmount: noop
  };

  store: RootStore;

  constructor(props) {
    super(props);
    this.store = this.props.store();

    // debug log
    if (process.env.NODE_ENV !== 'production') {
      if (this.store.debug) {
        const { version } = require('../../package.json');
        console.log(`iflux@${version}`);
        console.log('RootProvider enable debug mode');
        (global || window)['Root'] = { store: this.store };
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
    return (
      <RootContext.Provider value={this.store}>
        {this.props.children}
      </RootContext.Provider>
    );
  }
}
