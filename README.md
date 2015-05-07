## what is iflux ?

**iflux = immutable.js + react.js**


## Why React ?
[React.js](http://facebook.github.io/react/)犹如Facebook的文化基因所强调的一样move fast and break things, 在快速前进中打破了很多我们对于web开发的固有认识。
更厉害的是React把这种创新平移到移动开发(React native)实现了Learn once, Write everywhere.


## React的特点

1. 强调组件化的开发方式（更高的抽象层次，更好的分离关注点）

2. 声明式的开发风格（更好的表现力）

3. 单向的数据流动（简单可预测）

4. 超高性能的渲染60fps不是梦 （掌声在哪里？）

5. 最大的创新源于virtual dom （以及virtual native）

6. 轻量，可以在现有的系统中快速试错

7. 精确的生命周期，更简单的整合第三方的库(jquery)


## 我们期待走的更远

因为React的定位就是轻量级高效组件式的view library，但是在我们实际的应用开发工程中不仅仅需要处理view的问题，更复杂的是对于状态的控制。
官方的[flux](https://facebook.github.io/flux/docs/overview.html)架构提供了一个很好的针对React的架构指导，但是代码量很大。
说到底flux就是在解决一个数据流向以及控制状态变化问题。这点om确实做的非常出色，
借助于Clojure的数据的特性（1. 数据不可变 2. 持久化数据结构 3.共享数据结构）在不断的追寻下，immutable.js出现在了眼前，如获至宝。
随着对immutable.js深入挖掘，发现正好契合了React的架构特点，可以使用Immutable很好的管理我们的Store，因为Immutable强调值语义，
能够更好的追踪状态的变化(cursor)且带来了更好的性能。


## 保持简单

```
+-----------------------+
|       WebApi          |
+-----------------------+
          |  
         \|/
+-----------------------+
|   Store（immutable）   |<-----+
+-----------------------+      |
           |                   |
           | StoreMixin        | msg(EventEmitter)
          \|/                  |
+------------------------+     |
|     React App          |-----|
+------------------------+
|      <Layout>          |
|        <SearchForm/>   |
|        <Toolbar/>      |
|        <DataGrid/>     |
|       </Layout>        |
+------------------------+
```

一个应用只有一个Store，单根数据源，单向数据流动，数据沉淀在顶层。
且通过PureRenderMix可以获取更好的性能。简直就是为React私人定制一般。

于是，顺其自然的写了iflux去更好的粘合React和immutable。

整体思路：

1. React只承担view应该承担的事情（1. 资料呈现 2. 用户交互） 不处理任何的业务逻辑，就是根据数据去渲染dom即可，这样view可以做的很轻。

2. 应用的全部数据沉淀在一个Store中，当全部数据在顶层时，很多事情都变得简单，因为获取数据变得十分廉价。无论是校验和对数据的转换控制都变得非常简单。

3. React只是取数据渲染，其他的比如状态的变化全部通过事件pubsub通知appstore去更新数据。如果状态不会影响其他组件的级联变化可以放在组件内部消化掉。

4. 所有的ajax封装在webapi模块中，全部promise化。回调回来通过cursor更新store, cursor更新store， store通知React去rerender。

5. 区分View component 和 pure component。


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
