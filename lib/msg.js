/**
 * 使用更简洁的EventEmitter(完全没用dom的影子，只是一个callback队列)作为我们的消息中心
 *
 * 在没用使用React之前，使用jQuery使用pubsub的方案对模块进行解耦，不需要借助第三方的插件
 * 简单的使用jquery自定义事件来做即可。
 * 比如var msg = $({});
 *
 * msg.on('loveYou', function(event, param){});
 * msg.trigger('loveYou');
 *
 * 不好地方，一个pubsub却带有dom的影子会走jQuery的event dispatcher，然后参数的传递不能传递数组类型。
 *
 * 主要想简单的使用node EventEmitter模块，其实略感这个模块有点大，其实很可以简化。
 * 做到一个minievent。
 */
var EventEmitter = require('events').EventEmitter;

var emitter = module.exports = new EventEmitter();

//infinit max listeners
emitter.setMaxListeners(0);
