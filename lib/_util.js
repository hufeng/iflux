/**
 * Description: iflux内部的工具类
 */


/**
 * 是不是debug状态
 * 判断是浏览器环境还是node环境，放在在node中测试代码
 */
var IS_DEBUG = (typeof(window) === 'undefined') ? true :  top.window.location.hash === '#debug';


/**
 * 包装console.log
 */
exports.log = function() {
  IS_DEBUG
  && console
  && console.log
  && console.log.apply(console, arguments);
};


/**
 * 判断是不是数组
 *
 * @param arr
 * @returns {boolean}
 */
exports.isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};


/**
 * 获取对象的所有key
 *
 * alias Object.keys
 * @param obj
 * @returns {Array}
 */
exports.keys = function (obj) {
  var keyArr = [];
  obj = obj || {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keyArr.push(key);
    }
  }

  return keyArr;
};
