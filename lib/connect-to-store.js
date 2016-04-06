/**
 * 随着es2015的发布，我们也要跟着时代的变化，全面进入es6时代
 * 首先我们要解决的就是react的mixins的问题，因为es6没有对应的概念
 * 但是，通过高阶函数的wrapper，我们仍可以很优雅的解决这个问题。
 */
var React = require('react');


//expose
module.exports = connectToStore;

/**
 * connectToStore
 *
 * 通过高阶函数的封装使React的view和Immutable的数据层关联起来，并且可以感知到immutable的数据变化
 * @param store immutable的数据中心
 * @param reset 是否需要每次初始化的时候重置数据
 */
function connectToStore (store, reset = true) {
  return function StoreContainer (Component) {
    return class StoreProvider extends React.Component {
      constructor (props, context) {
        super (props, context);

        //如果设置了重置数据，则在每次init的时候重置store
        if (reset) {
          store.reset ();
        }

        this.state = {
          data: store.data ()
        };


        this._onIfluxStoreChange = this._onIfluxStoreChange.bind(this);
      }

      componentWillMount () {
        this._mounted = false;
      }

      componentDidMount () {
        this._mounted = true;
        store.onStoreChange (this._onIfluxStoreChange);
      }

      componentWillUpdate () {
        this._mounted = false;
      }

      componentDidUpdate () {
        this._mounted = true;
      }

      componentWillUnmount () {
        this._mounted = false;
        store.removeStoreChange (this._onIfluxStoreChange);
      }

      render () {
        return <Component {...this.props} store={ this.state.data }/>
      }

      /**
       * 监听Store
       */
      _onIfluxStoreChange(nextState, path){
        if (this._mounted) {
	        this.setState(() => {
            return { data: nextState }
          });
         }
      }
    }
  }
}
