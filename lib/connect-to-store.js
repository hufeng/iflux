/**
 * 随着es2015的发布，我们也要跟着时代的变化，全面进入es6时代
 * 首先我们要解决的就是react的mixins的问题，因为es6没有对应的概念
 * 但是，通过高阶函数的wrapper，我们仍可以很优雅的解决这个问题。
 */
var React = require('react');
var assign = require('object-assign');
var merge = Object.assign || assign;

//expose
module.exports = connectToStore;

/**
 * connectToStore
 *
 * 通过高阶函数的封装使React的view和Immutable的数据层关联起来，并且可以感知到immutable的数据变化
 * @param store immutable的数据中心
 * @param reset 是否需要每次初始化的时候重置数据
 */
function connectToStore(store, reset) {
  return function StoreContainer(Component) {
    return React.createClass({
      displayName: 'StoreProvider',

      getInitialState: function() {
        //如果设置了重置数据，则在每次init的时候重置store
        if (reset) {
          store.reset();
        }

        return {
          data: store.data()
        };
      },

      componentWillMount: function() {
        this._mounted = false;
      },

      componentDidMount: function() {
        this._mounted = true;
        store.onStoreChange (this._onIfluxStoreChange);
      },

      componentWillUpdate: function() {
        this._mounted = false;
      },

      componentDidUpdate: function() {
        this._mounted = true;
      },

      componentWillUnmount: function() {
        this._mounted = false;
        store.removeStoreChange (this._onIfluxStoreChange);
      },

      render: function() {
        return React.createElement(Component, merge({}, this.props, {store: this.state.data}));
      },

      /**
       * 监听Store
       */
      _onIfluxStoreChange: function(nextState, path){
        if (this._mounted) {
          this.setState(function(){
            return { data: nextState }
          });
         }
      },
    });
  }
}
