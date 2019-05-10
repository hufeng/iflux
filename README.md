> I think, I am 🔥🔥🔥

<pre>
技术也是时尚驱动的，我们常常臣服于时尚,
面对快速的变化常常让我们局促不安
开始焦虑，唯恐错过了些什么,怎么打破这种焦虑？
需要在快速变化得世界里保持清醒，保持独立的思考和认知
让我们回归到技术的本质, 因为解决了真实的问题，技术才变得有价值
<strong>真正牛*的技术，都是静悄悄的跑在线上...</strong>
</pre>

### what is iflux ?

_iflux = immer.js + react.js_

a simple state container for React ecosystem.

### Features

- Progressive
- Light-weight
- Reactive
- Predict
- Scalable
- Trace Data Flow

[![NPM](https://nodei.co/npm/iflux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iflux/)

### Why React?

[React.js](http://facebook.github.io/react/)犹如 Facebook 的文化基因所强调的一样 break things and move fast, 在快速前进中打破了很多我们对于 web 开发的固有认识。
更厉害的是 React 把这种创新平移到移动开发(React native)实现了 Learn once, Write everywhere.

### React features

1. 强调组件化的开发方式（更高的抽象层次，更好的分离关注点）

2. 声明式的开发风格（更好的表现力）

3. 单向的数据流动（简单可预测）

4. 超高性能的渲染（掌声在哪里？）

5. 最大的创新源于 virtual dom （UI VM）

6. 轻量，可以在现有的系统中快速试错

7. 精确的生命周期，更简单的整合第三方的库(jquery)

### why iflux

因为 React 的定位就是轻量级高效组件式的 view library，但是在我们实际的应用开发工程中不仅仅需要处理 view 的问题，更复杂的是对于状态的控制。

官方的[flux](https://facebook.github.io/flux/docs/overview.html)架构提供了一个很好的针对 React 的架构指导，但是代码量很大。

说到底 flux 就是在解决一个数据流向以及控制状态变化问题。这点 om 确实做的非常出色，
借助于 Clojure 的数据的特性（1. 数据不可变 2. 持久化数据结构 3.共享数据结构）

在不断的追寻下，immutable.js 出现在了眼前，如获至宝。
随着对 immutable.js 深入挖掘，发现正好契合了 React 的架构特点，可以使用 Immutable 很好的管理我们的 Store，因为 Immutable 强调值语义，
能够更好的追踪状态的变化(cursor)且带来了更好的性能。

随着 js 代码量越来越大,我们需要更 safety, scalable 的方式来开发前端，所以我们采用 typescript，但是 immutable 和 ts 配合的还不够好，随着技术的变化，immer.js 这样的小而美的库很好的解决了 js 的值不可变问题，又能很好和 typescript 配合起来

### 保持简单 -- KISS

![iflux-flow](https://raw.githubusercontent.com/hufeng/iflux/4.0/screencast/iflux-flow.png)

### Getting started

```shell
npm install iflux --save
```

react-native environment

```shell
npm install iflux --save
npm install babel-plugin-iflux --save-dev
```

//.babelrc

```javascript
{
  "plugins":[["iflux","reactnative": true]]
}
```

### simple example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, useRelax, Provider } from 'iflux';

// create state container
const store = createStore({
  state: {
    text: '你一抹微笑如茉莉^_^',
    count: 1
  }
});

// relax container
function Greeting() {
  const [text, count, setState] = useRelax(['text', 'count']);

  // mutation
  const inc = () =>
    setState(state => {
      state.count++;
    });

  return (
    <div>
      <span>{text}</span>
      <a href='javascript:void(0);' onClick={inc}>
        +{count}
      </a>
    </div>
  );
}

// create Page
function App() {
  return (
    <Provider store={store}>
      <Greeting />
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

### 更多 demo 在线体验

[SmileDemo](https://codesandbox.io/embed/8ljj0kvw6j)

[Counter](https://codesandbox.io/embed/zl3jqo1lm)

[todo](https://codesandbox.io/embed/ny43wyw9j)

### page service

在项目中，我们遵循 page service 的划分理念，即每个页面都是一个独立的前端的服务

每个页面有自己独立的 store, action, ui 组件

在需要跨页面的数据共享和数据更新的场景中，在整个系统的顶层使用<RootProvider>进行包装

就可以解决此场景下的问题

建议目录结构:

```text
/tmp/awesome
❯ tree -L 2
.
├── good-list
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
├── index
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
├── index.ts
├── mine
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
├── order-confirm
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
├── order-list
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
├── setting
│   ├── action.ts
│   ├── component
│   ├── index.ts
│   ├── store.ts
│   └── webapi.ts
└── shopping-cart
    ├── action.ts
    ├── component
    ├── index.ts
    ├── store.ts
    └── webapi.ts

14 directories, 29 files
```

## Domain Object

### Provider

连接当前的页面的组件 和当前的页面的数据容器(store)，在 provider 内部将 store 绑定在当前的页面上下文

方便 relax 注入数据源, Provider 提供了两个生命周期的回调 onMounted, willUnmout 方便进行一些全局操作

```javascript
import { Provider } from 'iflux';

// 创建一个页面的数据store
const store = createStore({ state: { text: 'hello world' } });

function App() {
  const onMounted = store => {
    store.dispatch('onInit');
  };

  const willUnmount = store => {
    console.log('unmounted');
  };

  return (
    <Provider store={store} onMounted={onMounted} willUnmount={willUnmount}>
      <Hello />
    </Provider>
  );
}
```

### useRelax

使用 React@16.8 的新特性 React hook, 以一种声明式的风格获取 store 中的数据， 以及更变 store 中的 state 的方式

```javascript
import React from 'react';
import { useRelax } from 'iflux';

function Hello() {
  const { id, title, content } = useRelax(['id', 'title', 'content']);

  return (
    <div>
      <div>{id}</div>
      <div>{title}</div>
      <div>{content}</div>
    </div>
  );
}
```

useRelax 数组中的参数风格是对应的数据的路径

假设我们的 store 中的 state 数据结构是

```js
createStore({
  state: {
    list: [{ id: 1, title: 'hello iflux', conent: 'welcome' }],
    motto: 'build tools for human',
    nest: { user: { where: 'nanjing' } }
  }
});
```

1. 假如想获取 list 中的，index 为 0 的 title

   对应的路径是 ['list', 0, 'title'] 或者 更简略是 'list.0.title'

   例如:

   ```javascript
   const { title } = useRelax(['list.0.title']);
   const { title } = useRelax([['list', 0, 'title']]);
   ```

   为啥是 const {title}, useRelax 在 parse 我们的数据路径是默认以最后一个路径为返回对象的 key

   那如果我想自定义这个字段 怎么办呢？那就以对象的方式来

   ```javascript
   const { a } = useRelax([{ a: 'list.0.title' }]);
   ```

2. 如果想获取 motto 也是以路径的方式

   ```javascript
   const { motto } = useRelax(['motto']);
   //自定义名字
   const { A } = useRelax([{ A: 'motto' }]);
   ```

3. 获取对象的嵌套路径, 获取 where

```javascript
const { where } = useRelax(['nest.user.where']);
//自定义
const { there } = useRelax([{ there: 'nest.user.where' }]);
```

> **所以说了这么多，其实就一条规则，以数据路径的方式来获取数据， 支持自定义最终的返回值得名称**

### Relax

Relax 是 useRelax 的降级模式，在低版本的不支持 React 的 hook 特性的 React class component 中，使用 Relax 这个 decorator 做到声明式的数据依赖注入

```typescript
import React from 'react';
import { Relax, TRelaxProps } from 'iflux';

// 参数和useRelax完全一致的数据路径风格
@Relax(['list.0.title', 'motto', 'nest.user.where'])
class Hello extends React.Component {
  relaxProps = {} as TRelaxProps<{
    title: string;
    motto: string;
    where: string;
  }>;

  render() {
    const { title, motto, where } = this.relaxProps;

    return (
      <div>
        <div>{id}</div>
        <div>{title}</div>
        <div>{content}</div>
      </div>
    );
  }
}
```

在 Relax 或者 useRelax 中不需要声明会自动注入改变 store 的 state 的方法，setState 和 dispatch

```javascript
function Hello() {
  const { title, setState, dispatch } = useRelax(['list.0.title']);

  //mutation
  const onChange = () =>
    setState(state => {
      state.list[0].title = 'hello iflux ++';
    });

  return (
    <div>
      <a href={'javascript:void(0);'} onClick={onChange}>
        setState
      </a>
      {title}
      <a href='javascript:void(0);' onClick={() => dispatch('change-title')}>
        dispatch
      </a>
    </div>
  );
}
```

dispatch VS setState

dispatch(msg: string, params?: any) 会自动的从 store 中寻找 action 作为数据更新，更好的 trace
setState(cb: (state) => void) 提供一种快速便捷修改 store 中 state 的方式，比如 form 中 field 的更新

> 优先使用 dispatch 进行数据更新

### Action

提供对 store 中数据修改的抽象

```javascript
// action.js
// 在这个文件定义所有的action
import { action } from 'iflux';

export const changeTitle = action('changeTitle', store => {
  store.setState(state => {
    state.list[0].title = 'hello iflux ++';
  });
});

//store.js去绑定所有的action
import { createStore } from 'iflux';
import * as action from './action';

export default createStore({
  action,
  state: {
    list: [{ id: 1, title: 'hello iflux', conent: 'welcome' }],
    motto: 'build tools for human',
    nest: { user: { where: 'nanjing' } }
  }
});
```

这样 relax 在 dispatch 的时候，就会从 store 中找寻那个 action 可以匹配 dispatch 的 msg 然后进行处理

### QL

QL = query language，一种简单的 reactive 的 DSL，类型 vue 的 compute 和 Redux 中的 selected

使用 QL 的抽象主要是对数据之间的关系进行抽象，将数据分为两种一个是 source data(源数据), 一种是 derive data(派生数据)
就是基于源数据和某个规则计算出来的数据， QL 就是封装派生数据，最后一个参数是计算规则，前面的参数全是源数据的路径

实际在前端有大量的这样的场景，比如，计算购物车的总金额，total = [(sku price * buy num)..... ]
当购买的数量还是单价发生了变化，total 就应该计算一次，

必须 excel，A1-A50 都是学生的成绩，A51 显示的是总分，对于 A51 来说就是一个规则, :=sum(A1, A50)只要 A1-A50 任何一行发生的变化
A51 都是自动重新计算一次

这样的好处，使我们的逻辑更加的清晰，我们通常只要关注源数据就可以了，
以及 store 中存放 state 都是源数据。

我们的 QL 会在 Relax 或者 useRelax 声明的依赖中自动计算，也许你会问，这样不会导致计算量变大吗？

这就是我们用 immutable 数据结构的优势，可以知道源数据有没有发生变化，可以方便的做 cache。

```javascript
import { QL } from 'iflux';

const helloQL = QL([
  //依赖的数据路径
  // store中的state的title数据路径
  'list.0.title',
  //store中的state的where的数据路径
  'nested.user.where',

  /**
   * transform function
   * title => list.0.title的值
   * where => nested.user.where的值
   * 然后一个返回值, 当依赖的数据路径对应的值任何一个发生
   * 了改变，改函数都会自动重新计算一次
   */
  (title, where) => {
    // computed
    return `${title} ++ ${where}`;
  }
]);

// QL支持嵌套
const worldQL = QL([
  helloQL,
  'motto',
  (hello, motto) => `${hello} +++ ${motto}`
]);
```

```typescript
import { helloQL, worldQL } from './ql';

function Hello() {
  const { helloQL } = useRelax([{ helloQL }]);

  return <div>{helloQL}</div>;
}

@Relax([{ worldQL }])
class World extends React.Component {
  relaxProps = {} as TRelaxProp<{ worldQL: string }>;
  render() {
    return <div>{this.relaxProps.worldQL}</div>;
  }
}
```

### EL

EL = Effect language, 对 sideEffect 的抽象, 和 QL 和类似但是不关心返回值，

主要就是监控源数据或者某个 ql 的值是不是发生变化，然后做一些额外的事情

比如发送 ajax，

EL 不支持嵌套，因为不保证有返回值 ^\_^

```js
import { EL } from 'iflux';

const helloEL = EL([
  //数据路径
  'list.0.title',
  helloQL,

  (title, helloQL) => {
    //send a ajax
  }
]);

// 执行的容器在store中
createStore({
  el: {helloEL}
  state: {}
})
```

### RootProvider, createRootStore

虽然我们的开发按照 page-service 的方式来进行拆分，保证清晰

但是在整个系统中常常需要在不同的页面进行数据的共享和更新

怎么解决跨页面的数据问题呢？

这个时候就需要 RootProvider, 这样就可以建立一个全局的上下文，在系统的顶层比如：

```javascript
ReactDOM.render(
  <RootProvider>
    <Router>
      <Route path='/' component={Blog} />
      <Route exact path='/blog-new' component={BlogCreate} />
      <Route exact path='/blog/:id' component={BlogDetail} />
    </Router>
  </RootProvider>,
  document.getElementById('app')
);
```

随着页面的加载渐进式的把页面的数据共享给 RootProvider,方便个页面的获取

比如一个业务流程，A -> B -> C, 按照我们的抽象 A, B, C 是三个页面

我们可以在 B 中获取 A 数据， 在 C 中获取 A，B 数据，

**如果在 A 中获取 B，C 的数据则可能出现错误**

怎么渐进式的共享

1. RootProvider 放在顶层

2. 各个页面的 store 设置 ns(namespace)避免数据的二义性

3. 如果需要全局的数据共享可以使用 createRootStore

```javascript
  //page-a.js
  const store = createStore({
    ns: 'page-a'
    state: {}
  })

  function PageA() {
    return (
      <Provider store={store}>
       <Page/>
      </Provider>
    );
  }

  //page-b.js
   const store = createStore({
    ns: 'page-b'
    state: {}
  })

  function PageB() {
    return (
      <Provider store={store}>
       <Page/>
      </Provider>
    );
  }

  //入口index.js

  function Index() {
    return (
      <RootProvider>
        <PageA/>
        <PageB/>
      </RootProvider>
    )
  }
```

那怎么获取共享数据呢？

relax 大法，在数据路径的开始@上父页面的 namespace，

如：

加入父页面的 store 设置的 ns 是, 'shoppingCart',

```js
createStore({
  ns: 'shoppingCart',
  state: {
    list: [{ id: 1, name: 'test商品', price: 0.01 }]
  }
});
```

子页面想获取价格:

```javascript
function Price() {
  const { price } = useRelax(['@shoppingCart.list.0.price']);

  return <div>{price}</div>;
}
```
