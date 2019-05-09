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

## Domain Object

### Provider

### useRelax

### Relax

### Action

### QL

### EL
