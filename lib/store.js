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
module.exports = function Store(/*Immutable.Map*/arg) {
  /**
   * 当前应用的数据
   */
  var state = Immutable.fromJS(arg || {});

  /**
   * 注册store change的callback
   */
  var callbacks = [];


  /**
   * 应用的数据
   */
  var data = function() {
    return state;
  };


  /**
   * 注册监听
   */
  var onStoreChange = function(callback) {
    callbacks.push(callback);
  };


  /**
   * 获取应用的cursor
   */
  var cursor = function() {
    var change = function (nextState, preState, path) {
      var nextData = nextState[_.isArray(path) ? 'getIn' : 'get'](path);
      _.log('cursor path: [', path.join(), '] store: ',
        (typeof(nextData) !== 'undefined') ? nextData.toString() : 'was deleted.');

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
   * 暴露给外面的方法
   */
  return {
    data: data,
    onStoreChange: onStoreChange,
    cursor: cursor
  };
};
