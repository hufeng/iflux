/**
 * 抽象我们的数据中心
 *
 * 其实是非常的的简单，就像flux架构，只是一些规约，根本不是很厚很重的框架代码，
 * 我们要做的就是更好在我们的应用和数据之间更好的粘合
 */
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var msg = require('./msg');


/**
 * 抽象数据对象
 */
var Store = module.exports = function (obj) {
  this.store = Immutable.fromJS(obj);
};


/**
 * 获取immutable数据
 */
Store.prototype.data = function () {
  return this.store;
};


/**
 * 获取immutable的数据部分数据，统一get，和getIn
 * 通过参数自动判断
 */
Store.prototype.get = function (path) {
  var isArray = Array.isArray(path);
  return this.store[isArray ? 'getIn' : 'get'](path);
};


/**
 * 获取整个应用数据的cursor，所有的数据更新只能通过cursor去更新
 */
Store.prototype.cursor = function () {
  console.log('cursorPath->', cursorPath);
  console.log('nextStore->', nextStore.toString());

  var onStoreChange = function (nextStore, preStore, cursorPath) {
    if (preStore != this.store) {
      throw new Error('attemped to alter expired data.');
    }
    this.store = nextStore;
    //整个应用的画龙点睛之处
    msg.emit('onStoreChange', this.store, cursorPath);
  }.bind(this);

  return Cursor.from(this.store, onStoreChange);
};
