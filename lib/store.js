var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var _ = require('./_util');


/**
 * 封装应用的核心Store，使用Immutable来trace change
 *
 * immutable真是和React是绝配啊，最初只是看到Om的架构
 * 感觉真是非常简洁，充分利用Clojure的数据结构的特性
 * 1. 不可变 2. 持久化数据结构 3. cursor局部更新数据
 *
 * 一直寻找这样的方案，对于Immutable.js如获至宝。所以
 * 对于Reactconf2015最期待的就是Immutable的分享。
 *
 * immutable使我们对于变化的跟踪变得更简单，且不变的数据共享
 * 又兼顾性能。
 */
module.exports = Store;

/**
 * 数据中心
 *
 * @param obj
 */
function Store(data) {
  if (!(this instanceof Store)) return new Store(data);

  //当前应用的数据
  this.data = Immutable.fromJS(data || {});

  //注册store change的callback
  this.callbacks = [];

  /**
   * 暴露给外面的方法
   */
  return {
    data: this.getData.bind(this),
    onStoreChange: this.onStoreChange.bind(this),
    cursor: this.cursor.bind(this)
  };
};


/**
 * 获取数据
 */
 Store.prototype.getData = function() {
   return this.data;
 };


/**
 * 获取store中的cursor
 */
Store.prototype.cursor = function() {
  //当前的数据
  var state = this.data;
  var callbacks = this.callbacks;


  /**
   * cursor发生变化的回调
   *
   * @param nextState 变化后的状态
   * @param preState 变化前状态
   * @param path cursor变化的路径
   */
   var change = function (nextState, preState, path) {
     var nextData = nextState[_.isArray(path) ? 'getIn' : 'get'](path);

     _.log(
       'cursor path: [', path.join(), '] store: ',
        (typeof(nextData) !== 'undefined' && nextData != null) ? nextData.toString() : 'was deleted.'
      );

      //判断是否出现数据不同步的情况
      if (preState != state) {
        throw new Error('attempted to altere expired data.');
      }

      state = nextState;

      callbacks.forEach(function (callback) {
        callback(nextState, path);
      });
    };

    return Cursor.from(state, change);
 };


/**
 * 绑定Store数据变化的回调
 */
 Store.prototype.onStoreChange = function() {
   this.callbacks.push(callback);
 };
