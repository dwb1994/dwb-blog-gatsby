---
title: React组件之间如何交流(ES6)
date: 2016-12-11
tags: [React]
photos: [https://ws1.sinaimg.cn/large/006cGJIjly1g12npt8bn1j31hc0zfna0.jpg]
type: blog
---

首先感谢这篇文章：[React组件之间如何交流](https://segmentfault.com/a/1190000004044592)

在最近的实习中，我使用react(es6)进行项目开发，在项目里收获了一些经验。

由于上面文章是es5写的，我在此基础上提炼一下，使用es6，结合自己项目里的思考，在这里记录一下：

React将视图抽象为一个个组件，每个组件都有一个state，记录组件的状态。当状态发生改变的时候，react内部执行diff判断组件是否需要更新，若需要更新则重新渲染。

组件之间的交流分为三类：

## 一、父组件向子组件传值：

通过props传值，父组件将需要传的值写在子组件的属性值里，子组件通过props可以访问到这个值。

``` javascript
class Father extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'father\'s value'
        }
    }
    render(){
        return (
            <div>
                father: {this.state.value}
                <Child value={this.state.value} />
            </div>
        )
    }
}
class Child extends React.Component {
    render(){
        return (
            <p>child: {this.props.value}</p>
        )
    }
}
```


## 二、子组件向父组件传值：

以回调函数的形式影响父组件。父组件将组件内自定义的回调函数的引用以属性的形式传给子组件，子组件内部可以通过props访问到这个函数，子组件在逻辑完成后调用这个回调函数即可执行父组件内部的函数。

注意：这里有个坑，组件内自定义的函数无法直接取到this的引用，需要用bind将this传进去，或者使用es6的箭头函数，个人认为后者更容易一些。（如下面Child组件的onCheckboxChange方法）

``` javascript
class MyContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }
    onChildChanged = (newState) => {
        this.setState({
            checked: newState
        })
    }
    render(){
        return (
            <div>点击状态: {JSON.stringify(this.state.checked)}
            <Child callbackParent={this.onChildChanged}
            initialChecked = {this.state.checked} />
            </div>
        )
    }
}

class Child extends Component {
    onCheckboxChange = () => {
        let newState = !this.props.initialChecked;
        this.props.callbackParent(newState);
    }
    render(){
        return (
            <div>
                <label>请点击: </label>
                <input type="checkbox"
                checked={this.props.initialChecked}
                onChange={this.onCheckboxChange}
                />
            </div>
        )
    }
}
```

## 三、组件之间传值：

这里我为了实现一个需求，企图通过用一个input输入框记录一个组件的值，通过这个输入框的onchange事件将change之后的值传给另一个组件，实现组件间的交流。实际上这样不可行，抛开写法混乱、违背了react数据单向流动的初衷不谈，本身是不可行的，**onchange监听不到脚本引起的value值的改变**。

通过网上查阅资料及咨询同事，我将需要传值的两个组件包含在同一个父组件之中，将传的值以state的形式存储于顶级组件中，通过一个组件调用回调函数影响顶级组件的state，再通过props来影响另一个子组件的渲染。

也可以使用refs，设置子组件的ref值，通过父组件的refs访问到子组件的自定义方法(回调函数)从而执行子组件的方法。



除了上述的行为外，两个不属于同一父组件的组件应该也可能有通信的需求，在上面的文章里有涉及，感兴趣的同学可以看一看。由于项目中没遇到，我就不在这里总结了。
