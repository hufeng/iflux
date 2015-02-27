var EventEmitter = require('events').EventEmitter;

/**
 * 使用更简洁的EventEmitter(完全没用dom的影子，只是一个callback队列)作为我们的消息中心
 */
var msg = module.exports = new EventEmitter();
