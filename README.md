### what is iflux ?

*iflux = immutable.js + react.js*


[![NPM](https://nodei.co/npm/iflux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iflux/)


### Why React ?
[React.js](http://facebook.github.io/react/)犹如Facebook的文化基因所强调的一样move fast and break things, 在快速前进中打破了很多我们对于web开发的固有认识。
更厉害的是React把这种创新平移到移动开发(React native)实现了Learn once, Write everywhere.


### React features

1. 强调组件化的开发方式（更高的抽象层次，更好的分离关注点）

2. 声明式的开发风格（更好的表现力）

3. 单向的数据流动（简单可预测）

4. 超高性能的渲染60fps不是梦 （掌声在哪里？）

5. 最大的创新源于virtual dom （以及virtual native）

6. 轻量，可以在现有的系统中快速试错

7. 精确的生命周期，更简单的整合第三方的库(jquery)


### 我们期待走的更远 - dare for more

因为React的定位就是轻量级高效组件式的view library，但是在我们实际的应用开发工程中不仅仅需要处理view的问题，更复杂的是对于状态的控制。
官方的[flux](https://facebook.github.io/flux/docs/overview.html)架构提供了一个很好的针对React的架构指导，但是代码量很大。
说到底flux就是在解决一个数据流向以及控制状态变化问题。这点om确实做的非常出色，
借助于Clojure的数据的特性（1. 数据不可变 2. 持久化数据结构 3.共享数据结构）在不断的追寻下，immutable.js出现在了眼前，如获至宝。
随着对immutable.js深入挖掘，发现正好契合了React的架构特点，可以使用Immutable很好的管理我们的Store，因为Immutable强调值语义，
能够更好的追踪状态的变化(cursor)且带来了更好的性能。


### 保持简单 -- KISS

* 建议：优先选择connectToStore 

```
+-----------------------+
|       WebApi          |
+-----------------------+
          |  
         \|/
+-----------------------+
|   Store（immutable）   |<-----+
+-----------------------+      |
           | //es5 style       |
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



### How to use?

```sh

mkdir hello
cd hello
npm init
npm install react immutable iflux --save
npm install babel-loader --save-dev

```

```
➜  iflux-demo  tree -L 3
.
├── apps                #we like django's app-style
│   └── index           #app-name
│       ├── index.js    #viewcontainer component
│       ├── component   #collect of dump components
│       ├── store.js    #immutable store
│       └── webapi.js   #fetch remote resource
├── node_modules
├── package.json
└── webpack.config.js

5 directories, 4 files

```

### Example

```javascript
//webapi.js

export const fetchGithub = (name) => {
  return fetch(`http://github.com/${name}`)
};

export default {
  fetchGithub
};


//store.js
import { Store, msg } from 'iflux';
import { fromJS } from 'immutable';
import { fetchGithub } from './webapi';

const appStore = Store({
  name: '',
  githubInfo: {}
});

exports default appStore;

//when use immutable's cursor to update store
//react's view will auto re-render
msg.on('updateName', (name) => {
  appStore.cursor().set('name', name);
});

msg.on('submit', async () => {
  const data = await fetchGithub(name);
  appStore.cursor.set('githubInfo', fromJS(data));
});


//index.js

//es5-style
import React from 'react';
import {msg, mixins} from 'iflux';
import appStore from './store';
const {StoreMixin} = mixins;


const IfluxApp = React.createClass({
  //自动将Store中的data混入到state
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


//es6-style
import React from 'react';
import { msg, connectToStore } from 'iflux';
import appStore from './store';

class IfluxApp extends React.Component {
  render() {
    const {store} = this.props;

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
  }
}

export default connectToStore(appStore)(IfluxApp);
```

## more

https://github.com/hufeng/iflux-validator-demo

https://github.com/hufeng/my-todo/tree/master/todo-iflux

https://github.com/hufeng/hn-news-iflux

https://github.com/QianmiOpen/react-starter
