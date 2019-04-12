> New Idea, New the World. 🔥🔥🔥

<pre>
技术也是时尚驱动的，我们常常臣服于时尚,面对快速的变化常常让我们局促不安
开始焦虑，唯恐错过了些什么,怎么打破这种焦虑？
需要在快速变化得世界里保持清醒，保持独立的思考和认知
让我们回归到技术的本质, 因为解决了真实的问题，技术才变得有价值
<strong>真正牛\*的技术，都是静悄悄的跑在线上...</strong>
</pre>

### what is iflux ?

_iflux = immer.js + react.js_

light-weight, Reactive and Predictable state container for React or ReactNative.

### Features

- Light-weight
- Reactive
- Predict
- Scalable
- Trace Data Flow

[![NPM](https://nodei.co/npm/iflux.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iflux/)

### Why React ?

[React.js](http://facebook.github.io/react/)犹如 Facebook 的文化基因所强调的一样 move fast and break things, 在快速前进中打破了很多我们对于 web 开发的固有认识。
更厉害的是 React 把这种创新平移到移动开发(React native)实现了 Learn once, Write everywhere.

### React features

1. 强调组件化的开发方式（更高的抽象层次，更好的分离关注点）

2. 声明式的开发风格（更好的表现力）

3. 单向的数据流动（简单可预测）

4. 超高性能的渲染 60fps 不是梦 （掌声在哪里？）

5. 最大的创新源于 virtual dom （UI VM）

6. 轻量，可以在现有的系统中快速试错

7. 精确的生命周期，更简单的整合第三方的库(jquery)

### 我们期待走的更远 - dare for more

因为 React 的定位就是轻量级高效组件式的 view library，但是在我们实际的应用开发工程中不仅仅需要处理 view 的问题，更复杂的是对于状态的控制。

官方的[flux](https://facebook.github.io/flux/docs/overview.html)架构提供了一个很好的针对 React 的架构指导，但是代码量很大。

说到底 flux 就是在解决一个数据流向以及控制状态变化问题。这点 om 确实做的非常出色，
借助于 Clojure 的数据的特性（1. 数据不可变 2. 持久化数据结构 3.共享数据结构）

在不断的追寻下，immutable.js 出现在了眼前，如获至宝。
随着对 immutable.js 深入挖掘，发现正好契合了 React 的架构特点，可以使用 Immutable 很好的管理我们的 Store，因为 Immutable 强调值语义，
能够更好的追踪状态的变化(cursor)且带来了更好的性能。

**changelog**

使用 immer.js 来管理数据的不可变，更好的结合 typescript 的类型体系

### 保持简单 -- KISS

![iflux-flow](https://raw.githubusercontent.com/hufeng/iflux/4.0/screencast/iflux-flow.png)

一个应用只有一个 Store，单根数据源，单向数据流动，数据沉淀在顶层。
且通过 PureRenderMix 可以获取更好的性能。简直就是为 React 私人定制一般。

于是，顺其自然的写了 iflux 去更好的粘合 React 和 immutable。

整体思路：

1. React 只承担 view 应该承担的事情（1. 资料呈现 2. 用户交互） 不处理任何的业务逻辑，就是根据数据去渲染 dom 即可，这样 view 可以做的很轻。

2. 应用的全部数据沉淀在一个 Store 中，当全部数据在顶层时，很多事情都变得简单，因为获取数据变得十分廉价。无论是校验和对数据的转换控制都变得非常简单。

3. React 只是取数据渲染，其他的比如状态的变化全部通过事件 pubsub 通知 appstore 去更新数据。如果状态不会影响其他组件的级联变化可以放在组件内部消化掉。

4. 区分 View component 和 pure component。

## TODO

contribute .....

## Domain Object

### Provider

### useRelax

### Relax

### Action

### QL

### EL
