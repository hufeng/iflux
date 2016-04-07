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

  //缓存初始状态的值
  this.init = this.data;

  //注册store change的callback
  this.callbacks = [];

  /**
   * 暴露给外面的方法
   */
  return {
    data: this.getData.bind(this),
    onStoreChange: this.onStoreChange.bind(this),
    removeStoreChange: this.removeStoreChange.bind(this),
    cursor: this.cursor.bind(this),
    reset: this.reset.bind(this)
  };
}


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
  /**
   * cursor发生变化的回调
   *
   * @param nextState 变化后的状态
   * @param preState 变化前状态
   * @param path cursor变化的路径
   */
   var change = function (nextState, preState, path) {
     var cpath = path.join() || 'root';

     _.log(
       '\ncursor:path: [', cpath, ']\n',
       '\nstore:\n',
        (nextState)
          ? JSON.stringify(nextState.toJSON(), '',  2)
          : 'is null. (Maybe was deleted.)'
      );

      //判断是否出现数据不同步的情况
      if (preState != this.data) {
        throw new Error('attempted to altere expired data.');
      }

      this.data = nextState;

      this.callbacks.forEach(function (callback) {
        callback(nextState, path);
      });
    }.bind(this);

    return Cursor.from(this.data, change);
 };


/**
 * 绑定Store数据变化的回调
 */
 Store.prototype.onStoreChange = function(callback) {
   //防止重复添加
   for (var i = 0,len = this.callbacks.length; i < len; i++) {
     if (callback === this.callbacks[i]) {
       return;
     }
   }
   this.callbacks.push(callback);
 };
 
 
 /** 
  * 解除Store的数据变化的绑定
  */
 Store.prototype.removeStoreChange = function(callback) {
   for (var i = 0, len = this.callbacks.length; i < len; i++) {
     if (this.callbacks[i] == callback) {
       this.callbacks.splice(i, 1);
       break;
     }
   }
 };



/**
 * 重置某个路径下的immutable值
 *
 * @param path 数据的路径
 */
 Store.prototype.reset = function(path) {
   if (path) {
     var isArray = _.isArray(path);
     var initVal = this.init[isArray ? 'getIn' : 'get'](path);

     //set
     this.cursor()[isArray ? 'setIn' : 'set'](path, initVal);
   } else {
     //如果path为空，整个数据全部回到初始状态
     this.data = this.init;
     var self = this;
     this.callbacks.forEach(function (callback) {
       callback(self.data);
     });
   }
 };
