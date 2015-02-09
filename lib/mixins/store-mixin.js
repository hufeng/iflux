var msg = require('../msg');

/**
 * store-mixins
 *
 * 自动的把中心数据mixin进入顶层的app
 * 是的原理非常的简单
 */
module.exports = (store) => {
  return {
    /**
     * 初始化状态
     */
    getInitialState() {
      return store.data();
    },


    /**
     * 当中心的数据发生变化的时候，改变顶层的app的state
     */
    componentDidMount() {
      if (this.isMounted()) {
        var _this = this;
        msg.on('onStoreChange', (newStore) =>{
          _this.replaceState(newStore);
        });
      }
    }
  };
}
