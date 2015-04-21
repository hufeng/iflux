# iflux
iflux = immutable.js + react.js

React.js犹如Facebook的文化基因所强调的一样move fast and break things，快速行动打破陈规。react确实打破了很多陈规。

1. 强调组件化的开发方式
2. 单向的数据流动（习惯后简直就是太舒服了）
3. 超高性能的渲染60fps不是梦
4. 最大的创新源于virtualdom


但是光有React还不足够，毕竟只是一个轻量级的库，而且专注于view。我们还有很多事情要做，官方的flux架构很cool但是感觉代码少多，说到底flux就是在解决一个数据流向已经控制状态变化问题。这点om确实做的非常出色，借助于Clojure的数据的特性（1. 数据不可变 2. 持久化数据结构）所以希望可以想om那样寻找一套解决方案。众里寻他千百度，immutable.js出现在了眼前，如获至宝。随着对immutable.js深入学习，发现正好契合了React的架构特点，单向数据流动，数据沉淀在顶层，只有一个Store即可。且通过PureRenderMix可以获取更好的性能。简直就是为React私人定制一般。

于是，顺其自然的写了iflux去更好的粘合React和immutable。
思路：

1. React只承担view应该承担的事情（1. 资料呈现 2. 用户交互） 不处理任何的业务逻辑，就是根据数据去渲染dom即可，这样view可以做的很轻。

2. 应用的全部数据沉淀在一个Store中，当全部数据在顶层时，很多事情都变得简单，因为获取数据变得十分廉价。无论是校验和对数据的转换控制都变得非常简单。

3. React只是取数据渲染，其他的比如状态的变化全部通过事件pubsub通知appstore去更新数据。如果状态不会影响其他组件的级联变化可以放在组件内部消化掉。

4. 因为所有的业务已经数据的变化控制都已经移到store统一处理，所以组件之间还剩下一种情况就是协调做一件事件。比如深或者很边缘的一个组件需要让另外完全不同级的组件协调做事情(比如做一个组件刷新)直接走pubsub。发消息沟通。

5. 所有的ajax封装在webapi模块中，全部promise化。回调回来通过cursor更新store。

Usage:

```sh

mkdir project
cd project
npm init
npm install react immutable iflux --save
npm install jsx-laoder --save-dev

```


```javascript
webapi.js

exports.fetchGithub = function(name) {
  return promise((defered) => {
    $ajax(url: '').done((data) => {
      deferred.resolve(data);
    });
  });
};

store.js

var {Store, msg} = require('iflux');
var webApi = require('./webapi');

var appStore = module.exports = Store({
  name: '',
  githubInfo: {}
});

msg.on('updateName', function(name) {
  appStore.cursor().set('name', name);
});

msg.on('submit', function() {
  webApi.fetchGithub(name).then((data) => {
    appStore.cursor.set('githubInfo', data);
  });
})



app.js
var React = require('react');
var iflux = require('iflux');
var msg = iflux.msg;
//自动将Store中的data混入到state
var StoreMixin = iflux.mixins.StoreMixin;
var appStore = require('./store');

var IfluxApp = React.createClass({
  mixins: [StoreMixin(appStore)],
  
  render() {
    var store = appStore.data();
    
    return (
      <div>
        <form onSubmit={this._submit}>
            <input name="name" onChange={this._handleChange}/>
        </form>
        <div>
          {store.get('githubInfo')}
        </div>
      </div>
    );
  },
  
  _handleChange(e) {
    msg.emit('updateName', e.target.value);
  },
  
  _submit() {
    msg.emit('getGithubInfo');
  }
});

```

## more

https://github.com/hufeng/iflux-validator-demo

https://github.com/hufeng/my-todo/tree/master/todo-iflux

https://github.com/hufeng/hn-news-iflux
