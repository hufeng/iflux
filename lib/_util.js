/**
 * Description: iflux内部的工具类
 */


/**
 * 是不是debug状态
 * 判断是浏览器环境还是node环境，放在在node中测试代码
 * 以前的方案是在url的后面直接加上debug，即可开启。
 * 但是这种模式在SPA的应用中华丽丽的挂了，因为SPA的路由多用#来标识
 * 所以我们要全新设计一套，这次不需要在URL中设置，我们在console中直接动态的改变
 *
 * 有个笑话，『当我写代码的时候，我与上帝同在。现在只有上帝知道。』
 * 那我们就开启我们的上帝模式吧。
 */
var IS_DEBUG = false;


/**
 * 判断当前的环境
 */
var ctx = (typeof(window) === 'undefined') ? process : window;


/**
 * 开启上帝模式
 */
ctx.god = function() {
  IS_DEBUG = true;
  console.log('iflux say:此刻为您开启上帝模式, 完美世界即将开启');
  return "ok";
};


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
