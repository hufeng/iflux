var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');

/**
 * 是不是debug状态
 */
var IS_DEBUG = top.window.location.hash === '#debug';

/**
 * 当前应用的数据
 */
var state;

/**
 * 注册store change的callback
 */
var callbacks = [];


/**
 * 包装console.log
 */
var log = function() {
  IS_DEBUG
    && console
    && console.log
    && console.log.apply(console, arguments);
};


/**
 * 判断参数是不是数组类型
 */
var isArray = function (data) {
  return Object.prototype.toString.call(data) === '[object Array]';
}


/**
 * 封装应用的核心Store，使用Immutable来trace change
 *
 */
module.exports = function Store(/*Immutable.Map*/arg) {
  state = Immutable.fromJS(arg);

  return {
    data: data,
    onStoreChange: onStoreChange,
    cursor: cursor
  };
};


/**
 * 应用的数据
 */
function data() {
  return state;
}


/**
 * 注册监听
 */
function onStoreChange(callback) {
  callbacks.push(callback);
}


/**
 * 获取应用的cursor
 */
function cursor() {
  var change = function (nextState, preState, path) {
    var nextData = nextState[isArray(path) ? 'getIn' : 'get'](path);
    log('cursor path: ',  path, ' store: ', (typeof(nextData) !== 'undefined') ? nextData.toString() : 'was deleted.');

    if (preState != state) {
      throw new Error('attempted to altere expired data.');
    }
    state = nextState;

    callbacks.forEach(function(callback) {
      callback(nextState, path);
    });
  };

  return Cursor.from(state, change);
}
