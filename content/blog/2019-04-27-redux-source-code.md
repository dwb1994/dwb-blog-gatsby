---
title: Redux 源码分析
date: 2019-04-27
tags: [redux]
type: blog
photos: []
---
# redux 源码分析

前段时间我读了 redux 的源码，redux 的源码很简洁，但质量很高，非常值得一读。如果你已经了解了 redux 的基本使用，想深入了解一下的话，可以看一下本文帮助理解。


## 一、简介
redux 核心 API 很少，只有 5 个 exports 和一个 store API：

* _[createStore(reducer, [preloadedState], [enhancer])](https://redux.js.org/api/createstore)_
*  [combineReducers(reducers)](https://redux.js.org/api/combinereducers) 
*  [applyMiddleware(…middlewares)](https://redux.js.org/api/applymiddleware) 
*  [bindActionCreators(actionCreators, dispatch)](https://redux.js.org/api/bindactioncreators) 
*  [compose(…functions)](https://redux.js.org/api/compose) 

[Store](https://redux.js.org/api/store) 	
* 	 [getState()](https://redux.js.org/api/store#getState) 
*  [dispatch(action)](https://redux.js.org/api/store#dispatch) 
*  [subscribe(listener)](https://redux.js.org/api/store#subscribe) 
*  [replaceReducer(nextReducer)](https://redux.js.org/api/store#replaceReducer) 

## 二、各个 API 实现原理
### 1. store API 与 createStore
store 是 Redux 最核心的概念，按照 Redux 的设计理念，一个应用应该只存在一个 store.

store 存储了整个应用的状态树，dispatch action 是修改 store 的唯一方式, 通过 createStore 这个函数来创建 store.

核心代码如下：

``` javascript
export default function createStore(reducer) {
    // 使用一个变量存储状态树
    let state;
    // 使用一个数组来存储当前的监听器, 监听器是一个函数
    let listeners = [];

    // 获取 store 中存储的状态树
    const getState = () => state;

    // dispatch 是修改 store 的唯一方式, 
    const dispatch = (action) => {
        // 调用 reducer 生成新的状态树
        state = reducer(state, action);
        // "依次"执行listeners 数组中存储的监听器
        listeners.forEach(listener => listener());
    };

    // 设置监听函数, state 变化时执行
    const subscribe = (listener) => {
        // 每设置一个监听函数, 就向 listeners 数组中添加一个监听器
        listeners.push(listener);
        return () => {
            // subscribe 函数返回一个 unsubscribe 方法, 用于卸载监听函数, 即从 listeners 数组中移除
            listeners = listeners.filter(l => l !== listener);
        }
    };

    // 使用 createStore 创建 store 时, 调用 dispatch 来初始化 state & listeners
    dispatch({});

    return { dispatch, subscribe, getState };
}
```

### 2. combineReducers
当应用复杂起来时，状态树会非常庞大，combineReducers 函数用于 Reducer 的拆分，提高代码可读性

核心代码如下：

``` js
// 传入的 reducers 是个对象，包含若干 reducer
const combineReducers = reducers => {
    // combineReducers 最终返回一个总的 reducer
    return (state = {}, action) => {
        // 从传入的 reducers 对象中取出 key 组成数组迭代
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                // 执行每个 reducers 以组成总的 reducer
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            }, // 第一个函数是一个回调函数，函数执行在数组中每个值
            {} // 第二个参数为初始值
        );
    };
};
```

### 3. applyMiddleware
中间件就是一个函数，参数是一个函数数组，对 store.dispatch 方法进行了改造，发出 Action 后，执行中间件，中间件处理完毕后，执行 Reducer 改变状态树。


核心代码如下：
``` js
export default function applyMiddleware(...middlewares) {
    // 第一次调用 applyMiddleware 返回的是一个函数，返回的函数再返回一个增强的 createStore 函数
    // 如何实现增强的？见下一个代码片段
    return createStore => (...args) => {
        const store = createStore(...args);
        // 中间件内部可以调用 getState 与 dispatch
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
        }
        // 中间件组成一个数组(chain)
        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        // 该数组嵌套执行 (使用了 compose 后面会讲)，用于增强 dispatch
        dispatch = compose(...chain)(store.dispatch);
        // 返回 store 的 api 和增强的 dispatch
        return { ...store, dispatch };
    }
}

```

applyMiddleware 即 enhancer，createStore 函数会首先判断是否有第三个参数 enhancer(即 applyMiddleware)，如果有的话调用 enhancer 来递归自己(前两个参数不变)，实现增强自己的效果
``` js
export default function createStore(reducer, preloadedState, enhancer) {
    // 健壮性判断
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.');
        }
        // enhancer 执行后返回增强后的 createStore，再次执行传入前两个参数不变
        return enhancer(createStore)(reducer, preloadedState);
    }
}
```

使用 compose 来实现函数数组的嵌套执行，嵌套的函数会依次执行，这样做的好处是：**方便编写插件**。

核心代码只是一个 reduce 函数：
``` js
// compose 接收一个函数数组 返回嵌套执行的结果
export default function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```
虽然只有一行，但是这行代码很重要，funcs.reduce 传入的函数返回的也是个函数，返回的函数将迭代的两个数组项组合成一个新的函数，这么说比较抽象，举个例子：

compose(functionA, functionB, functionC) 最终会返回 functionA( functionB( functionC(...args) ) ), 即执行顺序为 C > B > A . args 即 middlewareAPI

### 4. bindActionCreators

这是一个不常用的方法，将若干 actionCreator 转换成拥有同名 key 值的对象返回，返回的对象的每个属性都是一个函数，调用这些函数即可触发 dispatch

核心代码如下： 

``` js
// 工具方法
function bindActionCreator(actionCreator, dispatch) {
    return function() {
        return dispatch(actionCreator.apply(this, arguments));
    };
}
export default function bindActionCreators(actionCreators, dispatch) {
    // 健壮性处理: actionCreators 只传入一个函数
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
    }
    
    // 绑定后的 actions 对象
    const boundActionCreators = {};
    for (const key in actionCreators) {
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
            // 每个属性都是一个绑定了 action 的函数, 直接调用相当于触发 dispatch
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    }
    return boundActionCreators;
}

```


## 三、感悟
Redux 的代码，给人一种优雅的感觉，个人感觉它出色之处：
1. 开发体验好：API 简洁明了，容易上手，属于小而美的类型；配合 DevTools 提高开发效率
2. 插件丰富：一个灵活好用的插件系统可以使得程序主体尽可能简洁的同时拥有丰富强大的扩展性，这也是 Redux 引以为傲的一点：强大的插件生态，常用的插件都能很方便地找到
3. 文档完整：由浅入深，循循善诱。除了基本的使用说明，还阐述了它的设计思想，与其说 Redux 是个工具，不如说是一种设计思想