/**
 * store-mixins
 *
 * 自动的把中心数据mixin进入顶层的app
 * 是的原理非常的简单
 */
module.exports = function(store)  {
  return {
    /**
     * 初始化状态
     */
    getInitialState: function() {
      // 在SPA中，会出现数据保留在最新的状态，而不是初始化状态
      // 每次加载的时候就恢复到初始状态
      store.reset();
      return store.data();
    },


    /**
     * 当中心的数据发生变化的时候，改变顶层的app的state
     */
    componentDidMount: function() {
      var _this = this;
      store.onStoreChange(function(nextState, path) {
        if (_this.isMounted()) {
          _this.replaceState(nextState);
        }
      });
    }
  };
}
